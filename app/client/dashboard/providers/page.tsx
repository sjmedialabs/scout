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

export default function ServicesPage() {
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
const ITEMS_PER_PAGE = 3;
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
  useEffect(() => {
    async function fetchData() {
      try {
        setResLoading(true);

        const res = await fetch("/api/service-categories");
        const data = await res.json();

        const providerRes = await fetch("/api/providers");
        const providerData = await providerRes.json();

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

    fetchData();
  }, []);

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

  if (resLoading)
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" />
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-transparent">
      <div className="w-full -mt-4">
     <div className="  border-b mb-2 pb-1 text-xl font-medium">
      Find Agencies
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
      <div className="space-y-2">

        {paginatedProviders.map((p:any)=>(
          <div
            key={p._id}
            // className="flex items-center gap-6 rounded-2xl bg-[#fbf5fc] border p-2 pl-3 pt-2 shadow-sm"
            className="
              flex items-center gap-6 rounded-2xl bg-[#fbf5fc]
              border p-2 pl-3 pt-2 shadow-sm
              
              max-md:flex-col
              max-md:items-start
              max-md:gap-1
              "
              >

            {/* IMAGE */}
            <img
              src={p.coverImage || "/uploads/15ac2d8f-31f9-48ac-aadd-b67ba9f4d860-Artificial-intelligence-platforms-copy.jpg"}
              // className="w-[130px] h-[100px] rounded-xl object-cover"
              className="
                w-[130px] h-[100px] rounded-xl object-cover
                max-md:w-full
                max-md:h-[180px]
                "
            />

            {/* DETAILS */}
            <div className="flex-1">
              <div className="flex items-center gap-3 max-md:flex-wrap">
                <h3 className="text-xl font-semibold">{p.name}</h3>

                {p.isVerified && (
                  <span className="px-3 py-1 rounded-full text-xs text-white bg-gradient-to-r from-[#5fa8ff] to-[#3b82f6]">
                    ✓ Verified
                  </span>
                )}
              </div>

              <p className="text-gray-400 text-sm mt-0 line-clamp-2">
                {p.description}
              </p>

              <div className="flex sm:gap-3 gap-10 text-sm max-md:flex-wrap max-md:gap-x-6 max-md:gap-y-2 text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="text-orangeButton" size={16}/>
                {p.location || "Not specified"}
                </span>
                <span className="flex items-center gap-1">
                  <BriefcaseBusiness  className="text-orangeButton" size={16}/>
                {p.projectsCompleted} Projects
                </span>
                <span className="flex items-center gap-1">
                  <Users className="text-orangeButton" size={16}/>
                  {p.teamSize}
                </span>
              </div>

              <div className="mt-1 font-medium text-gray-700">
                Starting Price: ${p.hourlyRate}/hr
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 max-md:flex-col-2 max-md:w-full">

              {/* CONTACT */}
              <button
                onClick={()=>handleContact(p)}
                className="
                  px-6 py-2 rounded-full text-white text-sm font-semibold
                  bg-gradient-to-r from-[#6b6ee8] to-[#3c41c6]
                  shadow-md transition cursor-pointer
                  hover:shadow-[0_0_10px_rgba(99,102,241,0.6)] 
                "
              >
                Contact
              </button>

              {/* VIEW PROFILE */}

              <a
                href={`/provider/${p._id || p.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
              <button
                // onClick={()=>router.push(`/provider/${p._id}`)}
                className="
                  px-6 py-2 rounded-full text-white text-sm font-semibold
                  bg-gradient-to-r from-[#5b5fe0] to-[#2c34a1]
                  shadow-md transition cursor-pointer
                  hover:shadow-[0_0_10px_rgba(44,52,161,0.7)]
                "
              >
                View Profile
              </button>
              </a>

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

