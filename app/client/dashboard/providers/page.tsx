"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { Users, MessageCircle } from "lucide-react";
import { Star, DollarSign, Layers, MapPin , Grid2x2 } from "lucide-react";
import { BriefcaseBusiness } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RatingStars from "@/components/rating-star";
import ServiceDropdown from "@/components/select-category-filter";
import { authFetch } from "@/lib/auth-fetch";
import { useAuth } from "@/contexts/auth-context";

export default function ServicesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category") || null;

  const [resLoading, setResLoading] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryId
  );

  const [activeService, setActiveService] = useState<any | null>(null);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  const [ratingFilter, setRatingFilter] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [projectFilter, setProjectFilter] = useState<string>("");
  const [teamSizeFilter, setTeamSizeFilter] = useState<string>("");

  /* ---------------- PAGINATION ---------------- */
const ITEMS_PER_PAGE = 10;
const [page, setPage] = useState(1);

const totalPages = Math.ceil(
  filteredProviders.length / ITEMS_PER_PAGE
);

const paginatedProviders = filteredProviders.slice(
  (page - 1) * ITEMS_PER_PAGE,
  page * ITEMS_PER_PAGE
);

  const employeeSizes = [
    "1-9",
    "10-49",
    "50-99",
    "100-249",
    "250-499",
    "500-999",
    "1000+",
  ];

  /* ---------------- FETCH DATA ---------------- */
  const loadData = async () => {
    try {
        setResLoading(true);

        const res = await fetch("/api/service-categories");
        const data = await res.json();

        const providerRes = await fetch("/api/providers");
        const providerData = await providerRes.json();

        console.log('Provider Data is::::',providerData);

        // setProviders(providerData.providers || []);
        // setFilteredProviders(
        //   providerData.providers.sort((a: any, b: any) => b.rating - a.rating) ||
        //     []
        // );
        
        const providersList = providerData.providers || [];

          setProviders(providersList);

          setFilteredProviders(
            [...providersList].sort(
              (a: any, b: any) => b.rating - a.rating
            )
          );

        if (data.success) {
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setResLoading(false);
      }
  }
  useEffect(() => {
     loadData()
  }, []);
   useEffect(() => {
        if (!loading && (!user || user.role !== "client")) {
          router.push("/login");
        }
        if (user && !loading) {
          loadData();
        }
      }, [user, loading, router]);

  /* ---------------- FILTER + SORT ---------------- */
  useEffect(() => {
    let updatedProviders = [...providers];

    /*  Filter by Category (NEW) */
    if (selectedCategory) {
  // updatedProviders = updatedProviders.filter(
  //   (provider: any) =>
  //     String(provider.categoryId) === String(selectedCategory)
  // );
    updatedProviders = updatedProviders.filter((provider: any) =>
      provider.services?.includes(selectedCategory))
}

    /*  Filter by Active Service */
    // if (activeService) {
    //   updatedProviders = updatedProviders.filter((provider: any) =>
    //     provider.services?.includes(activeService.title)
    //   );
    // }

    /*  Filter by Team Size */
    if (teamSizeFilter) {
      updatedProviders = updatedProviders.filter(
        (provider: any) => provider.teamSize === teamSizeFilter
      );
    }

    /* Sorting */
    updatedProviders.sort((a, b) => {
      if (ratingFilter === "high-to-low" && b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      if (ratingFilter === "low-to-high" && a.rating !== b.rating) {
        return a.rating - b.rating;
      }

      if (priceFilter === "high-to-low" && b.hourlyRate !== a.hourlyRate) {
        return b.hourlyRate - a.hourlyRate;
      }
      if (priceFilter === "low-to-high" && a.hourlyRate !== b.hourlyRate) {
        return a.hourlyRate - b.hourlyRate;
      }

      if (
        projectFilter === "high-to-low" &&
        b.projectsCompleted !== a.projectsCompleted
      ) {
        return b.projectsCompleted - a.projectsCompleted;
      }
      if (
        projectFilter === "low-to-high" &&
        a.projectsCompleted !== b.projectsCompleted
      ) {
        return a.projectsCompleted - b.projectsCompleted;
      }

      return 0;
    });

    setFilteredProviders(updatedProviders);
    setPage(1);
  }, [
    providers,
    selectedCategory,
    activeService,
    ratingFilter,
    priceFilter,
    projectFilter,
    teamSizeFilter,
  ]);

  const handleContact = (provider: any) => {
    if (!provider.email) return;
    window.location.href = `mailto:${provider.email}?subject=Service Inquiry&body=Hi ${provider.name},%0D%0A%0D%0AI am interested in your services.`;
  };
   const handleViewProfile = async (providerId: string) => {
    // open profile page
    window.open(`/provider/${providerId}`, "_blank");
  };
   const handleMessage = async(agencyId:string) => {
          console.log("The recieved Agency Id is::",agencyId)
          console.log("The recieved Client Id is::",user.id)
          try{
            const conRes=await authFetch(`/api/chat/conversation`,{
                    method:"POST",
                    headers:{
                      "Content-Type":"application/json"
                    },
                    body:JSON.stringify({agencyId,clientId:user?.id})
        
                  })
            const data=await conRes.json();
            console.log("Chat response is:::",data);
            if(conRes.ok){
              router.push(`/client/dashboard/message?conversationId=${data.conversationId}&agencyId=${agencyId}`)
            }
          }catch(error){
            console.log("Failed to create the conversation:::",error)
          }
    };

  if (resLoading)
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" />
      </div>
    );

  const openProfileNewTab = (id: string) => {
  const url = `/provider/${id}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

  return (
    <div className="w-full min-h-screen bg-transparent">
      <div className="w-full -mt-4">
     <div className="border-b mb-2 pb-1">
      <h1 className="font-bold text-2xl">Find Agencies</h1>
      </div>
      {/* ---------------- FILTER BAR ---------------- */}

<div className="flex sm:gap-2 gap-4 mb-6 overflow-x-auto max-w-[96vw] w-full">

  {/* CATEGORY */}
  <div className="min-w-[120px]">
  <ServiceDropdown
    value={selectedCategory}
    onChange={(v) => setSelectedCategory(v)}
    placeholder="Category"
    triggerClassName="
      h-11 rounded-xl
      bg-[#F3F1FA]
      border border-[#E3E1F3]
      text-gray-500
      px-4 text-sm
      shadow-sm -mt-0
      
      max-md:h-9
max-md:px-2
max-md:text-xs
    "
    triggerSpanClassName="text-gray-500 text-sm"
    hoverClassName="bg-blue-50 text-[#3c41c6] hover:bg-blue-100"
  />
  </div>


  {[
    {
      value: ratingFilter,
      set: setRatingFilter,
      placeholder: "Rating",
      icon: <Star size={16} className="text-[#9B96C8]" />,
    },
    {
      value: priceFilter,
      set: setPriceFilter,
      placeholder: "Price",
      icon: <DollarSign size={16} className="text-[#9B96C8]" />,
    },
    {
      value: projectFilter,
      set: setProjectFilter,
      placeholder: "Projects",
      icon: <Layers size={16} className="text-[#9B96C8]" />,
    },
    
  ].map((f, i) => (
    <Select key={i} value={f.value} onValueChange={f.set}>
        <SelectTrigger
  className="
    h-11 rounded-xl
    bg-[#F3F1FA] cursor-pointer
    border border-[#E3E1F3]
    text-[#3A3A55]
    px-3 text-sm
    data-[placeholder]:text-gray-500
    shadow-sm
    [&>span]:flex
    [&>span]:items-center
    [&>span]:gap-1.5
  "
>
  <span>
    {f.icon}
    <SelectValue placeholder={f.placeholder} />
  </span>
</SelectTrigger>

      <SelectContent>
        <SelectItem value="high-to-low">High → Low</SelectItem>
        <SelectItem value="low-to-high">Low → High</SelectItem>
      </SelectContent>
    </Select>
  ))}

  
     <Select
  value={teamSizeFilter}
  onValueChange={(value) => setTeamSizeFilter(value)}>
        <SelectTrigger
          className="
            h-11 rounded-xl
            bg-[#F3F1FA] cursor-pointer
            border border-[#E3E1F3]
            text-[#3A3A55]
            px-3 text-sm
            data-[placeholder]:text-gray-500
            shadow-sm
            [&>span]:flex
            [&>span]:items-center
            [&>span]:gap-1.5
          "
        >
          <span>
            <Users size={16} className="text-[#9B96C8]" />
            <SelectValue placeholder="Team" />
          </span>
        </SelectTrigger>

              <SelectContent>
                {
                  employeeSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                      {size}
                  </SelectItem>
                    ))
                            
                  }
              </SelectContent>
            </Select>
            

          {/* CLEAR FILTER */}
          <Button
            onClick={() => {
              setSelectedCategory(null);
              setRatingFilter("");
              setPriceFilter("");
              setProjectFilter("");
              setTeamSizeFilter("");
            }}
            className="
              h-9 rounded-xl
              bg-gradient-to-r from-[#6b6ee8] to-[#3c41c6]
              hover:shadow-[0_0_10px_rgba(99,102,241,0.6)]
              border border-[#E3E1F3]
              text-white
              font-medium
              shadow-sm
              
            "
          >
            Clear Filters
          </Button>
        </div>

      {/* ---------------- PROVIDER LIST ---------------- */}
      <div className="grid grid-cols-1 mr-3 md:mr-0 md:grid-cols-2 lg:grid-cols-3 gap-3 ">

        {paginatedProviders.map((p:any)=>(
          // <div
          //   key={p._id}
            
          //   className="
          //     flex items-center gap-6 rounded-2xl bg-[#fbf5fc]
          //     border p-2 pl-3 pt-2 shadow-sm
              
          //     max-md:flex-col
          //     max-md:items-start
          //     max-md:gap-1
          //     "
          //     >

            
          //   <img
          //     src={p.coverImage || "/uploads/15ac2d8f-31f9-48ac-aadd-b67ba9f4d860-Artificial-intelligence-platforms-copy.jpg"}
            
          //     className="
          //       w-[130px] h-[100px] rounded-xl object-cover
          //       max-md:w-full
          //       max-md:h-[180px]
          //       "
          //   />

        
          //   <div className="flex-1">
          //     <div className="flex items-center gap-3 max-md:flex-wrap">
          //       <h3 className="text-lg">{p.name}</h3>

          //       {p.isVerified && (
          //         <span className="px-1 rounded-full text-[10px] text-white bg-gradient-to-r from-[#5fa8ff] to-[#3b82f6]">
          //           Verified
          //         </span>
          //       )}
          //     </div>

          //     <p className="text-gray-400 text-sm mt-0 line-clamp-2">
              
          //     </p>

          //     <div className="flex sm:gap-3 gap-10 text-sm max-md:flex-wrap max-md:gap-x-6 max-md:gap-y-2 text-gray-500 mt-2">
          //       <span className="flex items-center text-xs text-gray-400 gap-1">
          //         <MapPin className="text-orangeButton" size={13}/>
          //       {p.location || "Not specified"}
          //       </span>
          //       <span className="flex items-center text-xs text-gray-400 gap-1">
          //         <BriefcaseBusiness  className="text-orangeButton" size={13}/>
          //       {p.projectsCompleted} Projects
          //       </span>
          //       <span className="flex items-center text-xs text-gray-400 gap-1">
          //         <Users className="text-orangeButton" size={13}/>
          //         {p.teamSize}
          //       </span>
          //     </div>

          //     <p className="mt-1 text-gray-400 text-xs">
          //       Starting Price: <span className="font-semibold">${p.hourlyRate}/hr</span>
          //     </p>
          //   </div>

            
          //   <div className="flex gap-2 max-md:flex-col-2 max-md:w-full">

            
          //     <button
          //       onClick={()=>handleContact(p)}
          //       className="
          //         px-5 py-0 rounded-full text-white text-xs
          //         bg-[#e0332c] h-[30px]
          //         shadow-md transition cursor-pointer
          //         hover:shadow-[0_0_10px_rgba(99,102,241,0.6)] 
          //       "
          //     >
          //       Contact
          //     </button>

              

             
          //     <button
              
          //       className="
          //          px-5 py-0 rounded-full text-white text-xs
          //         bg-[#232a85] 
          //         shadow-md transition cursor-pointer
          //         hover:shadow-[0_0_10px_rgba(99,102,241,0.6)] 
          //       "
          //     >
          //       View Profile
          //     </button>
              

          //   </div>
          // </div>
          <div className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md flex flex-col h-full" key={p.id}>

                {/* Image */}
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={
                      p?.coverImage ||
                      "/uploads/15ac2d8f-31f9-48ac-aadd-b67ba9f4d860-Artificial-intelligence-platforms-copy.jpg"
                    }
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-col flex-1 p-4 justify-between">

                  {/* Verified + Rating */}
                  <div className="relative flex items-center -mt-1 h-2">

                    {/* LEFT — Verified */}
                    <div className="absolute left-0">
                      {p.isVerified && (
                        <span className="inline-flex items-center rounded-lg border font-bold px-2 py-0 text-[10px] text-green-500 bg-white">
                          Verified
                        </span>
                      )}
                    </div>

                    {/* RIGHT — Rating */}
                    <div className="absolute right-0 flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        <RatingStars rating={p.rating} />
                      </div>

                      <span className="text-xs font-semibold text-[#0E0E0E]">
                        {p.rating.toFixed(1)}
                      </span>
                    </div>

                  </div>

                  {/* Title + Description */}
                  <div className="py-3">
                    <h3
                      className="text-md font-bold text-[#0E0E0E] leading-tight"
                      
                    >
                      {p.name}
                    </h3>

                    {/* <p
                      className="text-[10px] font-semibold text-[#adb0b3] mt-0"
                      style={{ fontFamily: "CabinetGrotesk2" }}
                    >
                      {p.description}
                    </p> */}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap py-0 -mt-2">
                    {activeService && (
                      <span
                        className="inline-flex items-center rounded-lg bg-[#f2f2f2] border px-3 py-0.5 text-[10px] font-semibold text-slate-700"
                      >
                        {activeService}
                      </span>
                    )}
                  </div>

                  {/* Info Row */}
                  <div className=" grid-cols-3 text-[10px] font-semibold text-[#616161] mt-1">
                    <div className="inline-flex items-center mr-6 gap-1">
                      <img
                        src="/Location_Icon.jpg"
                        alt="Location"
                        className="h-3 w-3 object-contain"
                      />
                      {p.location || "Not specified"}
                    </div>

                    <div className="inline-flex items-center mr-6 gap-1">
                      <img
                        src="/Projects_Icon.jpg"
                        alt="Projects"
                        className="h-3 w-3 object-contain"
                      />
                      {p.projectsCompleted} projects
                    </div>

                    <div className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3 text-orangeButton" />
                      {p.teamSize || "Not specified"}
                    </div>
                  </div>

                  {/* Rate */}
                  <div className="text-xs text-[#616161] font-bold py-1">
                    Starting Price:
                    <span className="ml-1 text-gray-400">{p.hourlyRate}/hr</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      // className="flex-1 border hover:border-[#000000] cursor-pointer rounded-xl bg-[#e0332c] py-1 text-[10px] font-bold text-white hover:bg-white hover:text-black"
                      className="flex-1 border border-transparent cursor-pointer rounded-xl 
                      bg-[#e0332c] py-1 text-[10px] font-bold text-white
                       duration-700 ease-out
                      hover:bg-white hover:text-black hover:border-black transition-colors"
                     onClick={() =>
                        handleViewProfile(p.id)
                      }
                    >
                      View Profile
                    </button>

                    <button
                      // className="flex-1 border hover:border-[#000000] cursor-pointer rounded-xl bg-[#000000] py-1 text-[10px] font-bold text-white hover:bg-white hover:text-black"
                      className="flex-1 border border-transparent cursor-pointer rounded-xl 
                      bg-black py-1 text-[10px] font-bold text-white
                       duration-700 ease-out
                      hover:bg-white hover:text-black hover:border-black transition-colors"
                      onClick={() => handleMessage(p.userId)}
                    >
                      Contact
                    </button>
                  </div>
                </div>
            </div>
        ))}
      </div>

      {/* ---------------- PAGINATION ---------------- */}
      <div className="flex justify-center items-center gap-3 max-md:flex-wrap mt-8 text-sm">

        <button
          disabled={page===1}
          onClick={()=>setPage(p=>p-1)}
          className=" cursor-pointer text-black"
        >
          Prev
        </button>

        {Array.from({length:totalPages}).map((_,i)=>(
          <button
            key={i}
            onClick={()=>setPage(i+1)}
            className={`
              w-8 h-8 rounded-lg cursor-pointer
              ${page===i+1
                ? " bg-[#2c34a1] text-white font-semibold"
                : "text-gray-500"}
            `}
          >
            {i+1}
          </button>
        ))}

        <button
          disabled={page===totalPages}
          onClick={()=>setPage(p=>p+1)}
          className="text-black cursor-pointer "
        >
          Next
        </button>

      </div>
    </div>
    </div>
  );
}

