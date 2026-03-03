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
      className="rounded-2xl p-3 shadow-sm transition hover:shadow-md bg-[#f5f2fd]"
      style={{ borderTop: `4px solid ${borderColor}` }}
    >
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#F54A0C] flex items-center justify-center text-[#fff] font-semibold text-md">
            {data.title.charAt(0)}
          </div>

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
            <div className="p-2 rounded-full bg-[#F54A0C]">
                <DollarSign size={14} className="text-[#fff]"/>
              
            </div>
            <span>{data.amount}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-[#F54A0C] shrink-0">
              <span className="text-orange-500 text-xs"><Tag size={14} className="text-[#fff]"/></span>
            </div>
            <span>{data.category}</span>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 pl-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-[#F54A0C]">
              <Clock size={14} className="text-[#fff]" />
            </div>
            <span>{data.duration}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-[#F54A0C]">
              <CalendarDays size={14} className="text-[#fff]" />
            </div>
            <span>{data.date}</span>
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
            className="h-full bg-[#6366F1] transition-all duration-500 rounded-full"
            style={{ width: `${data.progress}%` }}
          />
        </div>
      </div>

      {/* Button */}
      <button
        onClick={()=>router.push("/agency/dashboard/projects")}
        className="mt-3 px-6 py-2 cursor-pointer rounded-full text-sm font-medium text-white 
                   bg-gradient-to-r from-indigo-500 to-indigo-600 
                   hover:opacity-90 transition"
      >
        View Project →
      </button>
    </div>
  )
}