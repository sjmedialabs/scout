"use client"

import { CalendarDays, Clock,DollarSign,Tag  } from "lucide-react"
import { useRouter } from "next/navigation"

type ProjectCardProps = {
  data: {
    id: string
    title: string
    amount: string
    duration: string
    category: string
    date: string
    progress: number
  }
  borderColor?: string
  
}

export default function ProjectCard({
  data,
  borderColor = "#F97316", // used for top border
 
}: ProjectCardProps) {
    const router=useRouter();
  return (
    <div
      key={data.id}
      className="rounded-2xl p-3 shadow-sm border-1 border-gray-200 transition hover:shadow-md"
      
    >
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {/* <div className="h-8 w-8 rounded-full bg-[#F54A0C] flex items-center justify-center text-[#fff] font-semibold text-md">
            {data.title.charAt(0)}
          </div> */}

          <div>
            <h3 className="font-semibold text-gray-800 text-base">
              {data.title}
            </h3>
           
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 capitalize">
          Active
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-2" />

      {/* Details Section */}
      <div className="grid grid-cols-2 text-sm text-gray-600">
        {/* Left Column */}
        <div className="space-y-4 pr-4 border-r border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex flex-row justify-center items-center h-5 w-5 rounded-full bg-[#F54A0C]">
                <DollarSign size={10} className="text-[#fff]"/>
              
            </div>
            <span className="text-xs">{data.amount}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-row justify-center items-center h-5 w-5 rounded-full bg-[#F54A0C]">
              <span className="text-orange-500 text-xs"><Tag size={10} className="text-[#fff]"/></span>
            </div>
            <span className="text-xs">{data.category}</span>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 pl-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-row justify-center items-center h-5 w-5 rounded-full bg-[#F54A0C]">
              <Clock size={10} className="text-[#fff]" />
            </div>
            <span className="text-xs">{data.duration}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-row justify-center items-center h-5 w-5 rounded-full bg-[#F54A0C]">
              <CalendarDays size={10} className="text-[#fff]" />
            </div>
            <span className="text-xs">{data.date}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 my-2" />

      {/* Progress */}
      <div>
        <div className="flex justify-end text-xs text-gray-500 mb-0">
          
          <span>{data.progress}% Complete</span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#F4561C] transition-all duration-500 rounded-full"
            style={{ width: `${data.progress}%` }}
          />
        </div>
      </div>

      {/* Button */}
      <button
        onClick={()=>router.push("/agency/dashboard/projects")}
        className="bg-[#3C3A3E] mt-2 hover:bg-[#000] h-[30px] w-[120px] cursor-pointer rounded-full text-white text-xs transition" 
      >
        View Project →
      </button>
    </div>
  )
}