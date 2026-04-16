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
import RatingStars from "@/components/rating -star-servicesPage";
import { Menu } from "lucide-react";
import ContactProviderModal from "@/components/leadPopupForm";


export default function ServicesPage() {
  const router=useRouter();
  const [visibleCount, setVisibleCount] = useState(9);
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category") || null;
  const subCategoryId=searchParams.get("subcategory") || null;
  const searchTerm=decodeURIComponent(searchParams.get("q") || "");
  console.log("Search Term is::::",searchTerm)

  

  const[resLoading,setResLoading]=useState(false);
    const [open, setOpen] = useState(false)
  

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

  const normalize = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ") // remove special chars like / - etc
    .replace(/\s+/g, " ") // remove extra spaces
    .trim();
};

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
  async function fetchCategories() {
    try {
      setResLoading(true);

      const res = await fetch("/api/service-categories");
      const data = await res.json();

      const providerRes = await fetch("/api/providers");
      const providerData = await providerRes.json();

      console.log("Fetched Providers:::", providerData.providers);

 const sortedProviders = [...(providerData.providers || [])].sort(
  (a, b) => {
    // First priority → rating (higher first)
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }

    // Second priority → planPrice (higher first)
    return b.planPrice - a.planPrice;
  }
);
      setProviders(sortedProviders);
      setFilteredProviders(sortedProviders);
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



/* ---------------- HANDLE CATEGORY / SUBCATEGORY FROM QUERY ---------------- */
useEffect(() => {
  if (!categories.length || !providers.length) return;

      // CATEGORY SELECTED (old behaviour)
      if (categoryId && !subCategoryId) {
        setOpenParent(categoryId);
        setOpenChild(null);
        setActiveService(null);
        setActiveServiceId(null);
        return;
      }

      // SERVICE SELECTED (subcategory query)
      if (subCategoryId) {
        let foundService: any = null;
        let parentCategory: any = null;
        let childCategory: any = null;

        categories.forEach((parent: any) => {
          parent.children?.forEach((child: any) => {
            child.items?.forEach((service: any) => {
              if (service._id === subCategoryId) {
                foundService = service;
                parentCategory = parent;
                childCategory = child;
              }
            });
          });
        });
        

        
        if (foundService) {
          setOpenParent(parentCategory._id);
          setOpenChild(childCategory._id);
          setActiveService(foundService.title);
          setActiveServiceId(foundService._id);

          // filter providers
        const filtered = providers.filter((provider: any) =>
      provider.services?.includes(foundService.title)
    );

    setFilteredProviders([...filtered]);
        }
      }

      // 🔹 SEARCH TERM LOGIC
  if (searchTerm) {
    let foundService = null;
    let parentCategory = null;
    let childCategory = null;

    categories.forEach((parent) => {
      parent.children?.forEach((child) => {
        child.items?.forEach((service) => {
          if (
            service.title.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            foundService = service;
            parentCategory = parent;
            childCategory = child;
          }
        });
      });
    });

    if (foundService) {
      setOpenParent(parentCategory._id);
      setOpenChild(childCategory._id);
      setActiveService(foundService.title);
      setActiveServiceId(foundService._id);

      const filtered = providers.filter((provider) =>
        provider.services?.includes(foundService.title)
      );

      setFilteredProviders([...filtered]);
    }
  }

  
}, [categories, providers, categoryId, subCategoryId,searchTerm]);
 
useEffect(() => {
 
}, [filteredProviders]);

 

  /* ---------------- FILTER + SORT PROVIDERS ---------------- */
useEffect(() => {
  let updatedProviders = [...providers];

  /* SEARCH FILTER */
  if (searchTerm) {
    const normalizedSearch = normalize(searchTerm);

    updatedProviders = updatedProviders.filter((provider: any) =>
      provider.services?.some((service: string) =>
        normalize(service).includes(normalizedSearch)
      )
    );
  }

  /* SERVICE FILTER */
  if (activeService) {
    updatedProviders = updatedProviders.filter((provider: any) =>
      provider.services?.includes(activeService)
    );
  }

  /* TEAM SIZE FILTER */
  if (teamSizeFilter) {
    updatedProviders = updatedProviders.filter(
      (provider: any) => provider.teamSize === teamSizeFilter
    );
  }

  /* SORTING */
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
  setVisibleCount(9);
}, [
  providers,
  activeService,
  searchTerm,
  ratingFilter,
  priceFilter,
  projectFilter,
  teamSizeFilter,
]);
 
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
  const handleServiceClick = (service: any, parentId: string, childId: string) => {
    console.log("Handle menu click prop service:::",service)
    console.log("Handle menu click prop parentId::",parentId)
    console.log("Handle menu click prop childId::",childId)
  setOpenParent(parentId);
  setOpenChild(childId);

  setActiveService(service.title);
  setActiveServiceId(service._id);

  // const filtered = providers.filter((provider: any) =>
  //   provider.services?.includes(service.title)
  // );

  // setFilteredProviders(filtered);
};

 return (
  <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white max-w-7xl mx-auto">

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
                      ? "text-orangeButton font-bold"
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
                              ? "text-orangeButton font-semibold"
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
                                handleServiceClick(item, parent._id, child._id)
                                setMobileSidebarOpen(false); // ✅ Auto close
                              }}
                              className={`ml-4 mt-4 cursor-pointer p-0 rounded-md
                              ${
                                activeServiceId === item._id
                                  ? "text-orangeButton font-bold"
                                  : "text-gray-600 hover:text-orangeButton"
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
                  ? "text-white font-bold bg-orange-600 py-1"
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
                          ? "text-white font-semibold bg-orange-500 py-1"
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
                          onClick={() => handleServiceClick(item, parent._id, child._id)}
                          className={`ml-4 mt-2 cursor-pointer p-2 rounded-md
                          ${
                            activeServiceId === item._id
                              ? "text-orangeButton font-bold py-1 bg-orange-100"
                              : "text-gray-600 hover:text-orangeButton"
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
      <div className="flex flex-row gap-4 mb-3 pb-2 justify-between overflow-x-auto">
        {/*Ratings filter */}
        
        <div className="w-full mb-3 sm:mb-0 ">
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
              rounded-full
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
         <div className="w-full mb-3 sm:mb-0 ">
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
                    rounded-full
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
        <div className="w-full mb-3 sm:mb-0">
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
                    rounded-full
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
        <div className="w-full mb-3 sm:mb-0">
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
                    rounded-full
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
            className="btn-blackButton h-[32px]"
          >
            Clear
          </Button>
        </div>


      </div>

      {/* Providers Grid */}
      <div>
        {filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 max-h-[100vh] overflow-y-auto [scrollbar-width:none] 
          [-ms-overflow-style:none]        
          [&::-webkit-scrollbar]:hidden">
            {filteredProviders.slice(0, visibleCount).map((p: any) => (
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
                  <div className="relative flex items-center -mt-1 h-2">

                    {/* LEFT — Verified */}
                    <div className="absolute left-0 ">
                      {p.isVerified && (
                        <span className="inline-flex mr-2 items-center rounded-full border font-bold px-2 py-0 text-xs text-white bg-[#232a85]">
                          Verified
                        </span>
                      )}
                      {p.isFeatured && (
                            <span className="bg-[#F54A0C] inline-flex items-center rounded-full border font-bold px-2 py-0 text-xs text-white">
                              Featured
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
                  <div className=" grid-cols-3 text-[11px] font-semibold text-[#616161] mt-1">
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
                    <span className="ml-1 text-gray-400">{p.hourlyRate}₹/hr</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex  justify-between gap-3 pt-1">
                    <button
                      // className="flex-1 border hover:border-[#000000] cursor-pointer rounded-xl bg-[#e0332c] py-1 text-[10px] font-bold text-white hover:bg-white hover:text-black"
                      className="primary-button h-[25px] w-full"
                      onClick={() =>
                        router.push(`/provider/${p.id || p._id}`)
                      }
                    >
                      View Profile
                    </button>

                    <button
                      // className="flex-1 border hover:border-[#000000] cursor-pointer rounded-xl bg-[#000000] py-1 text-[10px] font-bold text-white hover:bg-white hover:text-black"
                      className="btn-blackButton h-[25px] w-full"
                      onClick={() => setOpen(true)}
                    >
                      Contact
                    </button>
                    <ContactProviderModal
                                      open={open}
                                      onClose={() => setOpen(false)}
                                      userId={p.userId}    
                                      />
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

        {/* Load More Button */}
            {visibleCount < filteredProviders.length && (
              <div className="flex justify-center mt-3">
                <Button
                  onClick={() => setVisibleCount((prev) => prev + 9)}
                  className="bg-[#e0332c] border text-white px-6 py-2 rounded-xl
                  hover:bg-white hover:text-black hover:border-black transition-colors"
                >
                  Load More
                </Button>
              </div>
            )}
      </div>
    </div>

  </div>
);
}