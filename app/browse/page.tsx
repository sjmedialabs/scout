"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import { Search, Clock, DollarSign, ArrowRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function BrowsePage() {
  const [requirements, setRequirements] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("newest");
  const [bannerData, setBannerData] = useState({
    title: "",
    description: "",
    backgroundImageUrl: ""
  });

  // Hero filter states
  const [searchFilter, setSearchFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  useEffect(() => {
    async function loadBanner() {
      try {
        const res = await fetch("/api/cms?key=browse-requirements-banner");
        const data = await res.json();

        setBannerData({
          title: data?.content?.title || "Browse Requirements",
          description: data?.content?.subtitle || "Discover opportunities from businesses",
          backgroundImageUrl: data?.content?.image || "/images/banner.jpg"
        });

      } catch (error) {
        console.error("Banner Load Failed:", error);
      }
    }

    loadBanner();
  }, []);

  const categories = [
    "Website design",
    "Web Development",
    "Graphic Designing",
    "Mobile App",
    "Digital Marketing",
  ]
  const searchHandle = () => {
    let filtered = [...requirements];

    // Search match (title + description)
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      filtered = filtered.filter(r =>
        (r.title || "Title").toLowerCase().includes(q) ||
        (r.description || "Description").toLowerCase().includes(q)
      );
    }

    // Service Category Filter
    if (serviceFilter !== "all") {
      filtered = filtered.filter(r =>
        (r.category || "Category").toLowerCase().includes(serviceFilter.toLowerCase())
      );
    }

    // Location filter (if requirements have location)
    if (locationFilter !== "all") {
      filtered = filtered.filter(r =>
        (r.location?? "Location").toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setRequirements(filtered);
  };

  // ⬇️ Fetch Requirements From API
  useEffect(() => {
    async function loadReq() {
      try {
        const res = await fetch("/api/requirements")
        const data = await res.json()
        setRequirements(data.requirements || [])
      } catch (e) {
        console.error("Error fetching requirements:", e)
      } finally {
        setLoading(false)
      }
    }
    loadReq()
  }, [])

  useEffect(() => {
    if (requirements.length === 0) return;

    let sorted = [...requirements];

    if (sortBy === "newest") {
      sorted.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    if (sortBy === "budget-high") {
      sorted.sort((a: any, b: any) => {
        const maxA = Number(a.budgetMax || a.budget?.split("-")[1]?.replace(/\D/g, ""));
        const maxB = Number(b.budgetMax || b.budget?.split("-")[1]?.replace(/\D/g, ""));
        return maxB - maxA;
      });
    }

    setRequirements(sorted);
  }, [sortBy]);


  return (
    <div className="bg-background">
      {/* HERO SECTION */}
      <div
        className="px-4 lg:px-30 flex justify-center md:py-8 h-[65vh] md:h-[55vh] "
        style={{
          backgroundImage: `url(${bannerData.backgroundImageUrl || "/images/banner.jpg"})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 pt-4 md:pt-12">
            <h1 className="text-3xl font-bold text-[#F54A0C]">{bannerData.title}</h1>
            <p className="text-md text-[#b2b2b2]">{bannerData.description}</p>
          </div>

          {/* HERO FILTERS */}
          <Card className="mb-8 text-center rounded-3xl">
            <CardContent className="pt-6 pb-6 pl-9">
              <div className="grid md:grid-cols-4 gap-4">

                {/* Search Box */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search requirements..."
                    className="pl-10 shadow-none border-b-2 border-b-[#b2b2b2]"
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                </div>

                {/* Service Category */}
                <Select onValueChange={(value) => setServiceFilter(value)}>
                  <SelectTrigger className="border-0 border-b-2 border-b-[#b2b2b2] rounded-none shadow-none px-0">
                    <SelectValue placeholder="Service Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="website design">Website Design</SelectItem>
                    <SelectItem value="Web Development">Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>

                {/* Location */}
                <Select onValueChange={(value) => setLocationFilter(value)}>
                  <SelectTrigger className="border-0 border-b-2 border-b-[#b2b2b2] rounded-none shadow-none px-0">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="remote">Remote Only</SelectItem>
                  </SelectContent>
                </Select>

                {/* Search Button */}
                <Button
                  className="rounded-3xl bg-[#F54A0C] w-[120px] h-10"
                  onClick={searchHandle}
                >
                  Search Now
                </Button>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* LIST OF REQUIREMENTS */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-medium text-gray-400">List of Proposals</h2>

          <Select onValueChange={(val) => setSortBy(val)}>
            <SelectTrigger className="w-[150px] h-10">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="budget-high">Price High → Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <p className="text-center py-10 text-muted-foreground">Loading...</p>
        ) : (
          <div className="space-y-6">
            {requirements.map((req: any) => (
              <Card key={req.id} className="bg-blueBackground rounded-3xl p-4 shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start">

                    {/* CATEGORY BADGE */}
                    <Badge className="bg-gray-100 text-black rounded-full px-4 py-1 shadow-sm">
                      {req.category}
                    </Badge>

                    {/* TIME BADGE */}
                    <span className="text-xs text-orangeButton flex items-center gap-1">
                      <img src="/images/clock1.jpg" alt="" className="h-3" />
                      {req.postedDate}
                    </span>
                  </div>

                  {/* TITLE */}
                  <CardTitle className="text-2xl font-semibold mt-2 text-blueButton capitalize">
                    {req.title}
                  </CardTitle>

                  {/* DESCRIPTION */}
                  <p className="text-gray-600 mt-2 text-sm capitalize">{req.description}</p>

                </CardHeader>

                <CardContent>
                  <Separator></Separator>
                  {/* PRICE, TIMELINE & PROPOSALS */}
                  <div className="flex flex-wrap md:flex-nowrap gap-6 mt-4 text-xs font-semibold">

                    <div className="flex items-center gap-2">
                      <img src="/images/doller.jpg" alt="" className="h-5" />
                      {req.budget}
                    </div>

                    <div className="flex items-center gap-2 ">
                      <img src="/images/clock.jpg" alt="" className="h-5" />
                      {req.timeline}
                    </div>

                    <div className=" flex items-center gap-2">
                      <img src="/images/download.jpg" alt="" className="h-5" /> {req.proposals} proposals received
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-wrap gap-1 md:gap-4 items-center mt-6 ">
                    <Button variant="outline" className="rounded-full px-6 bg-blueButton text-white text-xs font-semibold" size="lg">
                      View Details<ArrowRight></ArrowRight>
                    </Button>
                    <Button className="rounded-full bg-black text-white px-6 text-xs font-semibold" size="lg">
                      Submit Proposal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* LOAD MORE */}
        <div className="text-center mt-10">
          <Button variant="outline" className="rounded-full px-8 py-2 bg-orangeButton text-white">
            Load More Requirements
          </Button>
        </div>
      </div>
    </div>
  )
}
