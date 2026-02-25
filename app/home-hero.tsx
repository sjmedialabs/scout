"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { categories } from "@/lib/mock-data";

interface HomeHeroProps {
  cms: any;
}

export function HomeHero({ cms }: HomeHeroProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeButton, setActiveButton] = useState<"match" | "browse">("match");


  console.log("Recieved Props CMS:::",cms);

  const handleGetMatched = async () => {
    if (searchQuery.trim()) {
      try {
        console.log("Tracking search keyword:", searchQuery.trim());
        const response = await authFetch("/api/search/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ keyword: searchQuery.trim() }),
        });
        console.log("Track response:", response);

        if (!response.ok) {
          console.error("Failed to track search keyword");
          throw new Error("Failed to track search keyword");
        }
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      } catch (err) {
        console.error("Error tracking search keyword:", err);
      }
    }
  };

  const handleLetUsMatch = () => {
    router.push("/register?type=match");
  };

  const handleBrowseOwn = () => {
    router.push("/browse");
  };

  const handlePopularSearch = (query: string) => {
  if (!query.trim()) return;

  if (activeButton === "match") {
    router.push(
      `/search?q=${encodeURIComponent(query)}&type=providers`
    );
  } else {
    router.push(`/browse?q=${encodeURIComponent(query)}`);
  }
};


  const handleSearch = () => {
  if (!searchQuery.trim()) return;

  router.push(
      `/search?q=${encodeURIComponent(searchQuery.trim())}&type=providers`
    );

  // if (activeButton === "match") {
  //   router.push(
  //     `/search?q=${encodeURIComponent(searchQuery.trim())}&type=providers`
  //   );
  // } else {
  //   router.push(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
  // }
};

  return (
    <section
      className="py-12 sm:py-12 px-4 sm:px-6 md:px-10 bg-gray-50 min-h-[80vh] flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${cms?.homeBannerImg || "/Banner.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full  ">
        <div className="w-full  flex flex-col items-center justify-center px-2 sm:px-4 md:px-8">
         <div className="text-center">
           <h1
            className="text-3xl font-normal  text-white mb-4 max-w-[600px]  text-center  leading-tight"
            style={{
              fontFamily: "'Cinzel', serif",
            }}
          >
            {cms?.homeBannerTitle ||
              "Connect with trusted companies for your next project."}
          </h1>

         </div>
          {/* Action Buttons */}
          

          {/* Search Section */}
          <div className="space-y-2 w-full max-w-md sm:max-w-xl md:max-w-2xl mb-2 mx-auto bg-white-50">
            <div className="relative flex items-center w-full gap-2">
              <Input
                placeholder="Discover Agencies by Service"
                className="flex-1 h-[50px]   text-white placeholder:text-gray-400 place border-slate-300 bg-white/20 backdrop-blur-md shadow-inner rounded-full px-4 sm:px-6 text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <Button
                onClick={handleSearch}
                className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center justify-center h-10  w-10 rounded-full bg-orangeButton shadow-md transition-all rotate-90"
              >
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </Button>
              
            </div>

            {/* Popular Searches */}
            <div className="space-y-3 sm:space-y-2 mt-3">
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                {categories.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-white border-slate-300 hover:bg-white/30 bg-transparentr rounded-full px-3 sm:px-4 text-xs sm:text-sm"
                    onClick={() => handlePopularSearch(search)}
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
