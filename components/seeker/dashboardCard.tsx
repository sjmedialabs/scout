import { ReactNode } from "react"

import { useRouter } from "next/navigation"

interface StatCardProps {
  title: string
  subtitle: string
  count?: number
  buttonText: string
  icon: ReactNode
  linkUrl?:string // for the navigation when click on the button

  // Customizable colors
  accentColor: string        // top border color
  gradientFrom: string       // button gradient start
  gradientTo: string         // button gradient end
  iconBg: string             // icon background color
}

export default function StatCard({
  title,
  subtitle,
  count,
  buttonText,
  icon,
  accentColor,
  gradientFrom,
  gradientTo,
  iconBg,
  linkUrl
}: StatCardProps) {
    const router=useRouter();
  return (
    <div className="relative bg-white flex flex-col justify-between rounded-2xl shadow-md py-3 px-2 w-full max-w-md">
      
      {/* Top Accent Line */}
      <div
        className="absolute top-0 left-0 w-full h-2 rounded-t-2xl"
        style={{ backgroundColor: accentColor }}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mt-2">
        <div
          className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            {title}
          </h3>
        </div>
      </div>

      <div>
        {count !== undefined && (
            <p className="text-2xl text-center font-bold text-gray-900">
              {count}
            </p>
          )}
      </div>

      <div>
        {/* Subtitle */}
            <p className="text-gray-500 mt-2 mb-1 text-xs">
                {subtitle}
            </p>

            {/* Button */}
                <button
            className="relative  w-full cursor-pointer py-2 text-xs rounded-xl font-medium overflow-hidden group transition-all duration-300 border border-gray-300"
            onClick={()=>router.push(linkUrl || "/client/dashboard")}
            >
            {/* Gradient Background Layer */}
            <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
                }}
            />

            {/* Button Text */}
            <span className="relative z-10 text-black group-hover:text-white transition-colors duration-300">
                {buttonText} →
            </span>
            </button>
      </div>
    </div>
  )
}