"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ServiceCard from "@/components/ServiceCard";
import { useRouter } from "next/navigation";
import {Star,  Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RatingStars from "@/components/rating-star";

import { Menu } from "lucide-react";


export default function ServicesPage() {
  const router=useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category") || null;

  const[resLoading,setResLoading]=useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<any[]>([]);

  const [openParent, setOpenParent] = useState<string | null>(categoryId);
  const [openChild, setOpenChild] = useState<string | null>(null);
  const [activeService, setActiveService] = useState<string | null>(null);

  const[activeServiceId,setActiveServiceId]=useState<string | null>(null);

  const[ratingFilter,setRatingFilter]=useState<string>("");
  const[priceFilter,setPriceFilter]=useState<string>("");
  const [projectFilter, setProjectFilter] = useState<string>("");
  const[teamSizeFilter,setTeamSizeFilter]=useState<string>("");

  const employeeSizes = [
  "1-9",
  "10-49",
  "50-99",
  "100-249",
  "250-499",
  "500-999",
  "1000+",
];

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
  async function fetchCategories() {
    try {
      setResLoading(true);

      const res = await fetch("/api/service-categories");
      const data = await res.json();

      const providerRes = await fetch("/api/providers");
      const providerData = await providerRes.json();

      setProviders(providerData.providers || []);
      setFilteredProviders(providerData.providers.sort((a, b) => b.rating - a.rating) || []);

      if (data.success) {
        let mainCats = data.data.filter((c: any) => c.parent === null);

        // Move query category to top
        if (categoryId) {
          mainCats = [
            ...mainCats.filter((c: any) => c._id === categoryId),
            ...mainCats.filter((c: any) => c._id !== categoryId),
          ];
        }

        setCategories(mainCats);
      }
    } catch (error) {
      console.error("Error fetching categories/providers:", error);
    } finally {
      setResLoading(false);
    }
  }

  fetchCategories();
}, []);

 

  /* ---------------- FILTER PROVIDERS based on the selected service ---------------- */
  // useEffect(() => {
  //   console.log("Active Service:", activeService);
  //   if (!activeService) return;
    

  //   const filtered = providers.filter((provider: any) =>
  //     provider.services?.includes(activeService.title)
  //   );

  //   setFilteredProviders(filtered);
  // }, [activeService, providers]);


  /* ---------------- FILTER + SORT PROVIDERS ---------------- */
   useEffect(() => {
  let updatedProviders = [...providers];

  /* 1️⃣ Filter by Active Service */
  if (activeService) {
    updatedProviders = updatedProviders.filter((provider: any) =>
      provider.services?.includes(activeService.title)
    );
  }

  /* 2️⃣ Filter by Team Size (NEW LOGIC) */
  if (teamSizeFilter) {
    updatedProviders = updatedProviders.filter(
      (provider: any) => provider.teamSize === teamSizeFilter
    );
  }

  /* 3️⃣ Apply Sorting */
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

    if (projectFilter === "high-to-low" && b.projectsCompleted !== a.projectsCompleted) {
      return b.projectsCompleted - a.projectsCompleted;
    }
    if (projectFilter === "low-to-high" && a.projectsCompleted !== b.projectsCompleted) {
      return a.projectsCompleted - b.projectsCompleted;
    }

    return 0;
  });

  setFilteredProviders(updatedProviders);

}, [
  providers,
  activeService,
  ratingFilter,
  priceFilter,
  projectFilter,
  teamSizeFilter
]);
  console.log("Filtered Proividers:", filteredProviders)

  const handleContact = (provider: any) => {
    if (!provider.email) return;
    window.location.href = `mailto:${provider.email}?subject=Service Inquiry&body=Hi ${provider.name},%0D%0A%0D%0AI am interested in your services.`;
  };

  if(resLoading){
     return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );

  }

 return (
  <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white">

    {/* ---------------- MOBILE HEADER ---------------- */}
    <div className="lg:hidden flex items-center px-6 justify-between p-1 border-b border-gray-200">
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="p-2 "
      >
        <Menu size={25} color="gray"/>
      </button>

      {/* <h2 className="text-sm font-semibold text-gray-700">
        Categories
      </h2> */}

      <div /> {/* Spacer */}
    </div>


    {/* ---------------- MOBILE SIDEBAR DRAWER ---------------- */}
    {mobileSidebarOpen && (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />

        {/* Drawer */}
        <div className="fixed top-0 left-0 h-full w-[75%] bg-white z-50 shadow-lg p-4 overflow-y-auto lg:hidden transition-transform duration-300">
          
          {categories.map((parent) => {
            const isParentOpen = openParent === parent._id;

            return (
              <div key={parent._id} className="mb-3 text-sm">
                <div
                  onClick={() =>
                    setOpenParent(isParentOpen ? null : parent._id)
                  }
                  className={`flex justify-between items-center cursor-pointer p-3 rounded-lg
                  ${
                    openParent === parent._id
                      ? "text-orange-600 font-bold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span>{parent.title}</span>
                  {isParentOpen ? <ChevronDown /> : <ChevronRight />}
                </div>

                {isParentOpen &&
                  parent.children?.map((child: any) => {
                    const isChildOpen = openChild === child._id;

                    return (
                      <div key={child._id} className="ml-4 mt-4">
                        <div
                          onClick={() =>
                            setOpenChild(isChildOpen ? null : child._id)
                          }
                          className={`flex justify-between items-center cursor-pointer p-0 rounded-md
                          ${
                            openChild === child._id
                              ? "text-orange-500 font-semibold"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <span>{child.title}</span>
                          {isChildOpen ? <ChevronDown /> : <ChevronRight />}
                        </div>

                        {isChildOpen &&
                          child.items?.map((item: any) => (
                            <div
                              key={item._id}
                              onClick={() => {
                                setActiveService(item);
                                setActiveServiceId(item._id);
                                setMobileSidebarOpen(false); // ✅ Auto close
                              }}
                              className={`ml-4 mt-4 cursor-pointer p-0 rounded-md
                              ${
                                activeServiceId === item._id
                                  ? "text-orange-600 font-bold"
                                  : "text-gray-600 hover:text-orange-500"
                              }`}
                            >
                              {item.title}
                            </div>
                          ))}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </>
    )}


    {/* ---------------- DESKTOP SIDEBAR ---------------- */}
    <div className="hidden lg:block w-[20%] border-r border-gray-200 p-6 overflow-y-auto">
      {categories.map((parent) => {
        const isParentOpen = openParent === parent._id;

        return (
          <div key={parent._id} className="mb-3 text-sm">
            <div
              onClick={() =>
                setOpenParent(isParentOpen ? null : parent._id)
              }
              className={`flex justify-between items-center cursor-pointer p-3 rounded-lg
              ${
                openParent === parent._id
                  ? "text-orange-600 font-bold"
                  : "hover:bg-gray-100"
              }`}
            >
              <span>{parent.title}</span>
              {isParentOpen ? <ChevronDown /> : <ChevronRight />}
            </div>

            {isParentOpen &&
              parent.children?.map((child: any) => {
                const isChildOpen = openChild === child._id;

                return (
                  <div key={child._id} className="ml-4 mt-2">
                    <div
                      onClick={() =>
                        setOpenChild(isChildOpen ? null : child._id)
                      }
                      className={`flex justify-between items-center cursor-pointer p-2 rounded-md
                      ${
                        openChild === child._id
                          ? "text-orange-500 font-semibold"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <span>{child.title}</span>
                      {isChildOpen ? <ChevronDown /> : <ChevronRight />}
                    </div>

                    {isChildOpen &&
                      child.items?.map((item: any) => (
                        <div
                          key={item._id}
                          onClick={() => {
                            setActiveService(item);
                            setActiveServiceId(item._id);
                          }}
                          className={`ml-4 mt-1 cursor-pointer p-2 rounded-md
                          ${
                            activeServiceId === item._id
                              ? "text-orange-600 font-bold"
                              : "text-gray-600 hover:text-orange-500"
                          }`}
                        >
                          {item.title}
                        </div>
                      ))}
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>


    {/* ---------------- RIGHT SIDE (PROVIDERS) ---------------- */}
    <div className="w-full lg:w-[80%] p-4 lg:p-6 ">
       {/* Filters Section */}
      <div className="flex flex-row  mb-3   pb-2  gap-4 overflow-x-auto mx-1 lg:mx-3 ">
        {/*Ratings filter */}
        <div className="mb-3 sm:mb-0 ">
          {/* <p className="text-sm text-gray-500 ml-1">Rating</p> */}
              <Select
          onValueChange={(value) => setRatingFilter(value)}
          value={ratingFilter}
        >
          <SelectTrigger
            className={`
              border-2
              border-[#b2b2b2]
              cursor-pointer
              rounded-[8px]
              shadow-none
              focus:ring-0
              
              px-3
              h-11
              text-sm
              data-[placeholder]:text-[#98A0B4]
            `}
          >
            <SelectValue placeholder="Filter by Rating" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="high-to-low">High to Low</SelectItem>
            <SelectItem value="low-to-high">Low to High</SelectItem>
          </SelectContent>
        </Select>
        </div>

        {/* Price filter*/}
         <div className="mb-3 sm:mb-0">
          {/* <p className="text-sm text-gray-500 ml-1">Rating</p> */}
              <Select
                onValueChange={(value) => setPriceFilter(value)}
                value={priceFilter}
              >
                <SelectTrigger
                  className={`
                    border-2
                    border-[#b2b2b2]
                    cursor-pointer
                    rounded-[8px]
                    shadow-none
                    focus:ring-0
                    px-3
                    h-11
                    text-sm
                    data-[placeholder]:text-[#98A0B4]
                  `}
                >
                  <SelectValue placeholder="Filter by  Price" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="high-to-low">High to Low</SelectItem>
                  <SelectItem value="low-to-high">Low to High</SelectItem>
                </SelectContent>
              </Select>
        </div>

        {/* Projects filter */}
        <div className="mb-3 sm:mb-0">
          {/* <p className="text-sm text-gray-500 ml-1">Rating</p> */}
              <Select
                onValueChange={(value) => setProjectFilter(value)}
                value={projectFilter}
              >
                <SelectTrigger
                  className={`
                    border-2
                    border-[#b2b2b2]
                    cursor-pointer
                    rounded-[8px]
                    shadow-none
                    focus:ring-0
                    px-3
                    h-11
                    text-sm
                    data-[placeholder]:text-[#98A0B4]
                  `}
                >
                  <SelectValue placeholder="Filter by Projects" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="high-to-low">High to Low</SelectItem>
                  <SelectItem value="low-to-high">Low to High</SelectItem>
                </SelectContent>
              </Select>
        </div>

        {/* Team Size filter */}
        <div className="mb-3 sm:mb-0">
          {/* <p className="text-sm text-gray-500 ml-1">Rating</p> */}
              <Select
                onValueChange={(value) => setTeamSizeFilter(value)}
                value={teamSizeFilter}
              >
                <SelectTrigger
                  className={`
                    border-2
                    border-[#b2b2b2]
                    cursor-pointer
                    rounded-[8px]
                    shadow-none
                    focus:ring-0
                    px-3
                    h-11
                    text-sm
                    data-[placeholder]:text-[#98A0B4]
                  `}
                >
                  <SelectValue placeholder="Filter by Team" />
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
        </div>

        {/* Reset Filters Button */}
        <div className="mb-3 sm:mb-0 mt-0.5">
          <Button
            onClick={() => {
              setRatingFilter("");
              setPriceFilter("");
              setProjectFilter("");
              setTeamSizeFilter("");
            }}
            className="text-sm h-[30px] font-extralight rounded-xl  bg-orangeButton text-[#fff]"
          >
            Clear
          </Button>
        </div>


      </div>

      {/* Providers Grid */}
      <div>
        {filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[100vh] overflow-y-auto [scrollbar-width:none] 
          [-ms-overflow-style:none]        
          [&::-webkit-scrollbar]:hidden">
            {filteredProviders.map((p: any) => (
            <div className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md flex flex-col h-full">

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
                  <div className="flex items-center justify-between">
                    {p.isVerified && (
                      <span className="inline-flex items-center rounded-full bg-[#32359a] px-3 py-1 text-xs font-semibold text-white">
                        Verified
                      </span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        <RatingStars rating={p.rating} />
                      </div>

                      <span className="text-xs font-semibold text-[#0E0E0E]">
                        {p.rating.toFixed(1)}
                      </span>

                      
                    </div>
                  </div>

                  {/* Title + Description */}
                  <div className="py-2">
                    <h3
                      className="text-xl font-bold text-[#0E0E0E] leading-tight"
                      style={{ fontFamily: "CabinetGrotesk2" }}
                    >
                      {p.name}
                    </h3>

                    <p
                      className="text-xs font-semibold text-[#adb0b3] mt-1"
                      style={{ fontFamily: "CabinetGrotesk2" }}
                    >
                      {p.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 py-1">
                    {Array.isArray(p.tags) &&
                      p.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-[#f2f2f2] border px-3 py-0.5 text-xs font-semibold text-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  {/* Info Row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#616161] py-2">
                    <span className="inline-flex items-center gap-1">
                      <img
                        src="/Location_Icon.jpg"
                        alt="Location"
                        className="h-4 w-4 object-contain"
                      />
                      {p.location}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <img
                        src="/Projects_Icon.jpg"
                        alt="Projects"
                        className="h-4 w-4 object-contain"
                      />
                      {p.projectsCompleted} projects
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <Users className="h-4 w-4 text-orangeButton" />
                      {p.teamSize}
                    </span>
                  </div>

                  {/* Rate */}
                  <div className="text-sm text-[#616161] font-bold py-1">
                    Starting Price:
                    <span className="ml-1">{p.hourlyRate}/hr</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-2 pt-3">
                    <button
                      className="flex-1 cursor-pointer rounded-full bg-[#2c34a1] px-4 py-2 text-xs font-bold text-white hover:bg-[#3f437e]"
                      onClick={() =>
                        router.push(`/provider/${p.id || p._id}`)
                      }
                    >
                      View Profile →
                    </button>

                    <button
                      className="flex-1 cursor-pointer rounded-full bg-[#4d4d4d] py-2 text-xs font-bold text-white"
                      onClick={() => handleContact(p)}
                    >
                      Contact
                    </button>
                  </div>
                </div>
               </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center mt-20">
            No agencies found for this service.
          </div>
        )}
      </div>
    </div>

  </div>
);
}