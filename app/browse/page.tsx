"use client"

import { Search } from "lucide-react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

import { ProposalsHeader } from "@/components/requirements/ProposalsHeader"
import { ProposalCard } from "@/components/requirements/ProposalCard"
import { useEffect, useState } from "react"
import { Requirement } from "@/lib/types"

const bannerData={
    title:"Service Providers",
    description:"Find verified professionals for your next project",
    backgroundImageUrl:"/serviceProviderBanner.jpg"
  }

export default function BrowsePage() {

  const [requriments, setRequriments] =useState<Requirement[]>([]);
  const[filteredRequirements,setFilteredRequirements]=useState<Requirement[]>([]);
  const[searchFilter,setSearchFilter]=useState("");
  const[serviceType,setServiceType]=useState("");
  const[budgetRange,setBudgetRange]=useState("");
  const[resLoading,setResLoading]=useState(true);
  const[failed,setFailed]=useState(false);

  useEffect(() => {
    const fetchRequirements =async () => {
      setResLoading(true);
      setFailed(false)
      try {
        const res=await fetch("/api/requirements")
        console.log("Res from api", res)
        const data =await res.json()
        console.log("data from api", data.requirements)
        if (res.ok) {
          const mapped =data.requirements
          setRequriments(mapped)
          setFilteredRequirements(mapped)
          setFailed(false)
          setResLoading(false)
        }
      } catch (e) {
        console.log("failed to fetch the data",e)
        setFailed(true)
      }finally{
        setResLoading(false)
      }
    }
    fetchRequirements()
  }, [])
  // const proposals = requriments || []

  const handleApllyFilter=()=>{

   let filteredRequirementsTemp=[...requriments]
   if(searchFilter.trim()){
    filteredRequirementsTemp=filteredRequirementsTemp.filter((eachItem)=>(eachItem.title.toLowerCase().includes(searchFilter.trim().toLowerCase())))
   }
   if(serviceType && serviceType!=="all"){
      filteredRequirementsTemp=filteredRequirementsTemp.filter((eachItem)=>eachItem.category.toLowerCase().includes(serviceType.toLowerCase()))
   }
   if (budgetRange) {
  if (budgetRange === "0k-5k") {
    filteredRequirementsTemp = filteredRequirementsTemp.filter(
      (item) => item.budgetMax <= 5000
    )
  } 
  else if (budgetRange === "5k-10k") {
    filteredRequirementsTemp = filteredRequirementsTemp.filter(
      (item) => item.budgetMin >= 5000 && item.budgetMax <= 10000
    )
  } 
  else if (budgetRange === "10k-20k") {
    filteredRequirementsTemp = filteredRequirementsTemp.filter(
      (item) => item.budgetMin >= 10000 && item.budgetMax <= 20000
    )
  } 
  else if (budgetRange === "20k+") {
    filteredRequirementsTemp = filteredRequirementsTemp.filter(
      (item) => item.budgetMin > 20000
    )
  }
}
 
   setFilteredRequirements(filteredRequirementsTemp)

  }
  const handlePriceSorting=(recievedFilter:string)=>{
    let filteredRequirementsTemp=[...filteredRequirements]
    console.log(recievedFilter)
    if(recievedFilter==="price_asc"){
       filteredRequirementsTemp.sort(
       (a, b) => a.budgetMin - b.budgetMin
      )
    }
    else if(recievedFilter==="price_desc"){
           filteredRequirementsTemp.sort(
      (a, b) => b.budgetMin - a.budgetMin
     )
    }
    
    setFilteredRequirements(filteredRequirementsTemp)
  }

  return (
    <div className="bg-background">

  {/*  HERO SECTION  */}
  <section
  className="relative w-full overflow-hidden"
  style={{
    backgroundImage: `url(${bannerData.backgroundImageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  <div className="absolute inset-0 bg-white/35" />

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-16 sm:py-20">
    
    {/* TITLE */}
    <div className="text-center mb-10">
      <h1 className="text-[26px] sm:text-[32px] md:text-[40px] font-bold text-[#F54A0C]">
        Browse Requirements 
      </h1>
      <p className="mt-[-10] text-sm sm:text-base text-[#9b9b9b] leading-tight">
        Discover opportunities from businesses looking for your services
      </p>
    </div>

    {/* FILTER BAR */}
    <div className="flex justify-center">
      <div
        className="w-full max-w-5xl bg-white rounded-[28px]
                   shadow-[0_20px_40px_rgba(0,0,0,0.08)]
                   px-6 py-5 border"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_auto] gap-6 items-center">

          {/* Search */}
          <div className="flex items-center gap-2 border-b border-[#dcdcdc] pb-2">
            
            <Input
              placeholder="Search Requirement"
              value={searchFilter}
              onChange={(e)=>setSearchFilter(e.target.value)}
              className="border-0 p-0 h-auto text-[15px] placeholder:text-[#9b9b9b]
                focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Category */}
          <Select onValueChange={(value)=>setServiceType(value)} value={serviceType}>
            <SelectTrigger
            className="
                border-0 border-b border-[#dcdcdc] rounded-none px-0 pb-2
                text-[15px] font-normal
                focus-visible:ring-0 focus-visible:ring-offset-0

                [&_span]:text-[#9b9b9b]
                [&_span]:text-[15px]
                [&_span]:font-normal
            "
            >
            <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="web">Web Development</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
            </SelectContent>
          </Select>

          {/* Budget */}
          <Select onValueChange={(value)=>setBudgetRange(value)} value={budgetRange}>
            <SelectTrigger
            className="
                border-0 border-b border-[#dcdcdc] rounded-none px-0 pb-2
                text-[15px] font-normal
                focus-visible:ring-0 focus-visible:ring-offset-0

                [&_span]:text-[#9b9b9b]
                [&_span]:text-[15px]
                [&_span]:font-normal
            "
            >
            <SelectValue placeholder="Budget Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0k-5k">Under $5k</SelectItem>
              <SelectItem value="5k-10k">$5k – $10k</SelectItem>
              <SelectItem value="10k-20k">$10k – $20k</SelectItem>
              <SelectItem value="20k+">More than $20k</SelectItem>
            </SelectContent>
          </Select>

          {/* APPLY FILTER */}
          <Button
            className="h-10 px-6 rounded-full bg-[#F54A0C] hover:bg-[#d93f0b]
                       text-white text-[14px] font-medium whitespace-nowrap"
            onClick={handleApllyFilter}
          >
            <Filter className="h-4 w-4" />
            Apply Filter
          </Button>

        </div>
      </div>
    </div>
  </div>
</section>

      {(!resLoading && filteredRequirements.length!==0 && !failed)&& <div className="px-4 py-10">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <ProposalsHeader
            onSortChange={(value) => handlePriceSorting(value)}
          />

          {/* Cards */}
          <div className="space-y-8">
            {filteredRequirements?.map((item) => (
              <ProposalCard
                key={item.id}
                category={item.category}
                title={item.title}
                description={item.description}
                budget={`${item.budgetMin} - ${item.budgetMax}`}
                timeline={item.timeline}
                proposalsCount={item.proposalsCount}
                postedAgo={item.postedAgo}
                onView={() => console.log("View", item.id)}
                onSubmit={() => console.log("Submit", item.id)}
              />
            ))}
          </div>

        </div>
      </div>}
      {resLoading &&(
        <div className=" mt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

    </div>
  )
}