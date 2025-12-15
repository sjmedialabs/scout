"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, MapPin, Briefcase } from "lucide-react"
import Link from "next/link"
import RatingStars from "@/components/rating-star";
import { FaLocationDot } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import { useEffect, useState } from "react"

export default function ProvidersPage() {
  const providers = [
    {
      id: "1",
      image:"/provider1.jpg",
      name: "TechCraft Solutions",
      tagline: "Full-stack development experts",
      services: ["Web Development", "Mobile Apps", "API Development"],
      rating: 2.5,
      reviews: 127,
      location: "San Francisco, CA",
      verified: true,
      featured: true,
      completedProjects: 89,
      responseTime: "2 hours",
      startingPrice: "75",
    },
    {
      id: "2",
      name: "Creative Design Studio",
       image:"/provider2.jpg",
      tagline: "Bringing your vision to life",
      services: ["UI/UX Design", "Branding", "Graphic Design"],
      rating: 4.2,
      reviews: 89,
      location: "New York, NY",
      verified: true,
      featured: false,
      completedProjects: 156,
      responseTime: "4 hours",
      startingPrice: "60",
    },
    {
      id: "3",
      name: "Growth Marketing Pro",
       image:"/provider3.jpg",
      tagline: "Data-driven marketing solutions",
      services: ["Digital Marketing", "SEO", "Content Strategy"],
      rating: 4.7,
      reviews: 156,
      location: "Austin, TX",
      verified: true,
      featured: true,
      completedProjects: 203,
      responseTime: "1 hour",
      startingPrice: "85",
    },
    {
      id: "4",
       image:"/provider4.jpg",
      name: "DataViz Analytics",
      tagline: "Transform data into insights",
      services: ["Data Analytics", "Business Intelligence", "Reporting"],
      rating: 4.9,
      reviews: 74,
      location: "Seattle, WA",
      verified: true,
      featured: false,
      completedProjects: 67,
      responseTime: "3 hours",
      startingPrice: "90",
    },
    {
      id: "5",
       image:"/provider1.jpg",
      name: "CloudOps Specialists",
      tagline: "Scalable cloud infrastructure",
      services: ["DevOps", "Cloud Migration", "System Architecture"],
      rating: 4.8,
      reviews: 92,
      location: "Denver, CO",
      verified: true,
      featured: false,
      completedProjects: 134,
      responseTime: "2 hours",
      startingPrice: "95",
    },
    {
      id: "6",
       image:"/provider3.jpg",
      name: "Mobile First Design",
      tagline: "Mobile-first approach to everything",
      services: ["Mobile App Design", "Responsive Design", "User Research"],
      rating: 4.6,
      reviews: 108,
      location: "Los Angeles, CA",
      verified: false,
      featured: false,
      completedProjects: 78,
      responseTime: "6 hours",
      startingPrice: "55",
    },
  ]

  const bannerData={
    title:"Service Providers",
    description:"Find verified professionals for your next project",
    backgroundImageUrl:"/serviceProviderBanner.jpg"
  }
  const[searchFilter,setSearchFilter]=useState("");
  const[serviceFilter,setServiceFilter]=useState("");
  const[locationFilter,setLocationFilter]=useState("");
  const[ratingFilter,setRatingFilter]=useState("");
  const[filteredData,setFilteredData]=useState([]);
  const[providersData,setProvidersData]=useState([])
  const[loading,setLoading]=useState(true)
  const[Failed,setFailed]=useState(false)
  useEffect(()=>{
    loadData();
  },[])
  console.log("Providers Datat::::::::::",providersData)
  const loadData=async()=>{
    setLoading(true)
    setFailed(false)
     try{
         const response=await fetch("/api/providers");
         const data=await response.json();
         console.log("Fetched  Data:::",data)
         setProvidersData(data.providers)
         setFilteredData(data.providers)
         setFailed(false)
     }catch(error){
      console.log("Failded To retrive the data:::",error)
      setFailed(true);
     }
     finally{
      setLoading(false)
     }
  }

  const searchHandle=()=>{
    console.log("Search Filter:::",searchFilter);
    console.log("Service Filter::",serviceFilter);
    console.log("Location Filter:::",locationFilter);
    let tempFilteredData=providersData;
    if(searchFilter.trim()!=""){
      tempFilteredData= tempFilteredData.filter((item) =>
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchFilter.toLowerCase())
    );
    }
    if (serviceFilter !== "all") {
    tempFilteredData = tempFilteredData.filter((eachItem) =>
      eachItem.services.some((service) =>
        service.toLowerCase().includes(serviceFilter.toLowerCase())
      )
    );
    }
    if(locationFilter !="all"){
      tempFilteredData=tempFilteredData.filter((eachItem)=>eachItem.location.toLocaleLowerCase().includes(locationFilter.toLocaleLowerCase()));
    }
    setFilteredData(tempFilteredData);
  }
  const handleHighestRating=(value:any)=>{
    let sortedData = [...filteredData]; // avoid mutating original array

  switch (value) {

    case "rating":
      sortedData.sort((a, b) => b.rating - a.rating);
      break;

    case "reviews":
      sortedData.sort((a, b) => b.reviews - a.reviews);
      break;

    case "price-low":
      sortedData.sort((a, b) => parseInt(a.startingPrice) - parseInt(b.startingPrice));
      break;

    case "price-high":
      sortedData.sort((a, b) => parseInt(b.startingPrice) - parseInt(a.startingPrice));
      break;

    default:
      return filteredData; // no sorting applied
  }

    setFilteredData(sortedData);
  }

  return (
    <div className="bg-background">
       {/*Hero section */}
        <div className="px-4 sm:px-6 md:px-10 
        pt-24 sm:pt-16 pb-12 overflow-hidden
        min-h-screen sm:min-h-[85vh] items-center 
        justify-start sm:justify-center" style={{
          backgroundImage:`url(${bannerData.backgroundImageUrl})`,
          backgroundRepeat:"no-repeat",
          backgroundSize:"cover",
          backgroundPosition:"center"
         }}>
     
            <div className="max-w-7xl mx-auto text-center ">
                {/* Header */}
                <div className="mb-8 px-2 sm:px-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#F54A0C] pt-6 sm:pt-10 mb-2">{bannerData.title}</h1>
                  <p className="text-sm sm:text-base md:text-lg text-[#b2b2b2] leading-sung px-3 sm:px-0">{bannerData.description}</p>
                </div>

                {/* Filters */}
                <Card className="mb-8 text-center rounded-3xl shadow-md sm:shadow-lg">
                  <CardContent className="pt-6 pb-6 px-4 sm:px-6 md:px-9">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">

                      {/* Search Input */}
                      <div className="relative w-fullmin-w-0">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search providers..." 
                        className="pl-10 w-full text:sm md:text-base border-0 border-b-2 border-b-[#b2b2b2] 
                        bg-transparent rounded-none shadow-none focus:outline-none focus:ring-0 focus:border-[#F54A0C]"  
                        onChange={(e)=>setSearchFilter(e.target.value)}/>
                      </div>

                      <div className="w-full min-w-0">
                        <Select onValueChange={(value)=>setServiceFilter(value)}>
                          <SelectTrigger
                            className="
                              mt-1
                              border-0 
                              border-b-2 
                              border-b-[#b2b2b2]
                              rounded-none
                              shadow-none
                              focus:outline-none
                              focus:ring-0 
                              focus:ring-offset-0
                              placeholder:text-[#b2b2b2]
                              px-0
                              w-full
                              h-12
                              text-sm
                              md:text-base
                            "
                          >
                            <SelectValue placeholder="Service Category" className="text-[#b2b2b2]"/>
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="all">All Services</SelectItem>
                            <SelectItem value="development">Development</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="consulting">Consulting</SelectItem>
                          </SelectContent>
                        </Select>
                        </div>

                      <div className="w-full min-w-0">
                      <Select onValueChange={(value)=>setLocationFilter(value)}>
                        <SelectTrigger className="
                              mt-1
                              border-0 
                              border-b-2 
                              border-b-[#b2b2b2]
                              rounded-none
                              shadow-none
                              focus:outline-none
                              focus:ring-0 
                              focus:ring-offset-0
                              px-0
                              w-full text-sm md:text-base h-12
                            ">
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
                      </div>

                      <div className="flex justify-center lg:justify-end">
                      <Button className="w-full sm:w-[150px] lg:w-[120px] h-10 mt-2 lg:mt-1
                     rounded-3xl bg-[#F54A0C] text-white
                     hover:bg-[#d93f0b] transition-all duration-300" onClick={searchHandle}>
                        Search Now
                      </Button>
                    </div>
                    </div>
                  </CardContent>
                </Card>
            </div>
        </div>


      <div className="py-8 px-4 lg:px-30">
        <div className="max-w-7xl mx-auto">

        <div className="flex justify-between my-8">
          <h1 className="text-3xl text-[#b2b2b2]">List of agencies</h1>
          <Select onValueChange={handleHighestRating}>
            <SelectTrigger
              className="
                bg-[#f5f5f5]
                h-12
                w-[180px]
                rounded-full
                shadow-none
                border border-[#e5e5e5]
                text-[#555]
                px-4
                focus:outline-none
                focus:ring-0
                focus:ring-offset-0
                focus:border-[#e5e5e5]
              "
            >
              <SelectValue placeholder="Highest Rating" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="rating">Highest Rating</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>


          {/* Providers Grid */}
           {
              Failed && (
                <div className="flex flex-col justify-center items-center text-center">
                  <h1 className="text-center font-semibold">Failed  to Retrive the data</h1>
                  <Button onClick={loadData} className="h-[40px] mt-2 w-[90px] bg-[#2C34A1] text-[#fff]">Reload</Button>
                </div>
              )
            }
            {loading && (
              <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          <div className="grid md:grid-cols-2 gap-6">
            {(filteredData.length!=0 && !loading && !Failed)?(filteredData.map((provider) => (

            <Card
  key={provider.id}
  className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
>
  {/* Image flush to top */}
  <div className="w-full">
    <img
      src={provider.coverImage}
      alt={provider.name}
      className="w-full h-[200px] sm:h-[240px] md:h-[300px] object-cover block"
    />
  </div>

  <div className="p-4 sm:p-6">
    {/* Badges + rating */}
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        {provider.isVerified && (
          <Badge className="bg-[#2C34A1] text-white h-7 px-3 rounded-2xl">Verified</Badge>
        )}
        {provider.isFeatured && (
          <Badge className="bg-[#F54A0C] text-white h-7 px-3 rounded-2xl">Featured</Badge>
        )}
      </div>

      <div className="flex items-center gap-1 text-sm">
        <RatingStars rating={provider.rating} />
        <span className="font-semibold">{provider.rating}</span>
        <span className="text-muted-foreground">({provider.reviewCount})</span>
      </div>
    </div>

    {/* Title + description (left aligned) */}
    <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-left">
      {provider.name}
    </h3>
    <p className="mt-1 text-sm text-[#b2b2b2] text-left">
      {provider.tagline}
    </p>

    {/* Tags – tighter gap to description */}
    <div className="flex flex-wrap gap-2 mt-3 sm:mt-3 mb-4">
      {provider.services.map((service) => (
        <Badge
          key={service}
          variant="outline"
          className="h-7 px-3 rounded-2xl bg-[#f2f2f2] text-[#000] text-xs sm:text-sm"
        >
          {service}
        </Badge>
      ))}
    </div>

    {/* Info row */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs sm:text-sm">
      <div className="flex items-center gap-2">
        <img src="/location-filled.jpg" className="h-4 w-4" />
        <span className="text-[#808080] font-semibold break-words">
          {provider?.location || "N/A"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <img src="/briefcase.jpg" className="h-4 w-4" />
        <span className="text-[#808080] font-semibold">
          {provider.projectsCompleted} projects
        </span>
      </div>
      <div className="flex items-center gap-2">
        <img src="/chat-operational.jpg" className="h-4 w-4" />
        <span className="text-[#808080] font-semibold">
          Response: {provider?.responseTime || "2 hrs"}
        </span>
      </div>
    </div>

    {/* Price + buttons */}
    <p className="text-[#808080] text-sm sm:text-base font-semibold">
      From: {provider.hourlyRate}/hour
    </p>

    <div className="mt-3 flex flex-col sm:flex-row gap-2">
      <Link href={`/provider/${provider.id}`} className="flex">
        <Button className="w-full sm:w-[140px] bg-[#2C34A1] hover:bg-[#2C34A1] rounded-3xl text-white">
          View Profile
        </Button>
      </Link>
      <Button className="w-full sm:w-[160px] bg-[#4d4d4d] rounded-3xl text-white">
        Contact Provider
      </Button>
    </div>
  </div>
</Card>

            ))):(<div className="text-center ml-[80px]">
              <p className="text-lg"></p>
            </div>)}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button variant="outline" className="bg-[#f7f5f6] rounded-2xl" size="lg">
              Load More Providers
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
