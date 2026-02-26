"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, Users } from "lucide-react";
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

        setProviders(providerData.providers || []);
        setFilteredProviders(
          providerData.providers.sort((a: any, b: any) => b.rating - a.rating) ||
            []
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
      updatedProviders = updatedProviders.filter(
        (provider: any) => provider.categoryId === selectedCategory
      );
    }

    /*  Filter by Active Service */
    if (activeService) {
      updatedProviders = updatedProviders.filter((provider: any) =>
        provider.services?.includes(activeService.title)
      );
    }

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

  if (resLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white ">
      
      {/* ---------------- FILTERS SECTION ---------------- */}
      <div className="flex flex-row  mb-3 pb-2 gap-4 max-w-[90vw] overflow-x-auto mx-1 lg:mx-3">

        {/* CATEGORY DROPDOWN (NEW) */}
       <div>
         <ServiceDropdown
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          placeholder="Filter by Category"
          contentClassName="text-[#000000]"
          triggerClassName="border-2 border-[#b2b2b2] text-[#000000] rounded-[8px] px-3 h-11 text-sm -mt-0"
          triggerSpanClassName="text-[#98A0B4] text-sm"
        />
       </div>

        {/* Rating */}
        <Select
          onValueChange={(value) => setRatingFilter(value)}
          value={ratingFilter}
        >
          <SelectTrigger className="border-2 data-[placeholder]:text-gray-300 border-[#b2b2b2] rounded-[8px] px-3 h-11 text-sm">
            <SelectValue placeholder="Filter by Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high-to-low">High to Low</SelectItem>
            <SelectItem value="low-to-high">Low to High</SelectItem>
          </SelectContent>
        </Select>

        {/* Price */}
        <Select
          onValueChange={(value) => setPriceFilter(value)}
          value={priceFilter}
        >
          <SelectTrigger className="border-2 data-[placeholder]:text-gray-300 border-[#b2b2b2] rounded-[8px] px-3 h-11 text-sm">
            <SelectValue placeholder="Filter by Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high-to-low">High to Low</SelectItem>
            <SelectItem value="low-to-high">Low to High</SelectItem>
          </SelectContent>
        </Select>

        {/* Projects */}
        <Select
          onValueChange={(value) => setProjectFilter(value)}
          value={projectFilter}
        >
          <SelectTrigger className="border-2 data-[placeholder]:text-gray-300 border-[#b2b2b2] rounded-[8px] px-3 h-11 text-sm">
            <SelectValue placeholder="Filter by Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high-to-low">High to Low</SelectItem>
            <SelectItem value="low-to-high">Low to High</SelectItem>
          </SelectContent>
        </Select>

        {/* Team */}
        <Select
          onValueChange={(value) => setTeamSizeFilter(value)}
          value={teamSizeFilter}
        >
          <SelectTrigger className="border-2 data-[placeholder]:text-gray-300 border-[#b2b2b2] rounded-[8px] px-3 h-11 text-sm">
            <SelectValue placeholder="Filter by Team" />
          </SelectTrigger>
          <SelectContent>
            {employeeSizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear */}
        <Button
          onClick={() => {
            setSelectedCategory(null);
            setRatingFilter("");
            setPriceFilter("");
            setProjectFilter("");
            setTeamSizeFilter("");
          }}
          className="text-sm h-[30px] font-extralight mt-1 rounded-xl bg-orangeButton text-[#fff]"
        >
          Clear
        </Button>
      </div>

      {/* ---------------- PROVIDERS GRID ---------------- */}
      {filteredProviders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[96vh] overflow-y-auto">
          {filteredProviders.map((p: any) => (
            <div
              key={p._id}
              className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md flex flex-col h-full"
            >
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
                <div className="flex items-center justify-between">
                  {p.isVerified && (
                    <span className="inline-flex items-center rounded-full bg-[#32359a] px-3 py-1 text-xs font-semibold text-white">
                      Verified
                    </span>
                  )}
                  <div className="flex items-center gap-1.5">
                    <RatingStars rating={p.rating} />
                    <span className="text-xs font-semibold text-[#0E0E0E]">
                      {p.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="py-2">
                  <h3 className="text-xl font-bold text-[#0E0E0E]">
                    {p.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#adb0b3] mt-1">
                    {p.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#616161] py-2">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-orangeButton" />
                    {p.location}</span>
                  <span className="inline-flex items-center gap-1">
                    <img src="/Projects_Icon.jpg" alt="Projects" className="h-4 w-4 object-contain" />
                    {p.projectsCompleted} projects</span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-4 w-4 text-orangeButton" />
                    {p.teamSize || 0}
                  </span>
                </div>

                <div className="text-sm text-[#616161] font-bold py-1">
                  Starting Price:
                  <span className="ml-1">{p.hourlyRate}/hr</span>
                </div>

                <div className="flex gap-2 pt-3 cursor-pointer">
                  <a href={`/provider/${p.id || p._id}`} className="flex-1" target="_blank">
                    <button
                    className="flex-1 cursor-pointer rounded-full bg-[#2c34a1] px-4 py-2 text-xs font-bold text-white"
                   
                  >
                    View Profile →
                  </button>
                  </a>
                  

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
  );
}