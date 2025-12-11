import React from "react"
import StatsGrid from "./StatsGrid"
import ServiceCard from "./ServiceCard"
import Image from "next/image"
import {Provider} from "./types/service"

interface CTA {
    heading: string
    sub: string
    buttonText:string
}

interface Stat {
    label: string
    value: string
}

interface ServicePageProps {
    title: string
    subtitle: string
    heroImage: string
    cta: CTA
    stats: Stat[]
    providers: Provider[]
}

export default function ServicePageLayout({
    title,
    subtitle,
    heroImage,
    cta,
    stats,
    providers,
}: ServicePageProps ) {
    return (
        <main className = "bg-white text-slate-900">

            {/* Hero Section */}
            <section className="relative isolate items-center justify-center text-center min-h-80">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                         src={heroImage} 
                         alt="Service Details Banner Image" 
                         fill
                         priority
                         className="object-cover"   
                    />
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
                </div>
                <div className="relative mx-auto max-w-7xl px-4 py-20 text-center md:px-8">
                    <h1 className="text-5xl font-extrabold text-orange-600"
                    style={{ fontFamily: 'CabinetGrotesk2'}}
                    >
                        {title}
                    </h1>
                    <p className="mx-auto mt-4 max-w-[720px] text-center text-base text-[#adb0b3] md:text-xl tracking-wide font-normal text-balance leading-[1.3]">
                        {subtitle}
                    </p>
                </div>
            </section>

{/* CTA Band */}
<section className="bg-white border-y border-[#E7E7E9] ">
  <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-10 flex items-center gap-4 justify-around">
    <div className="flex flex-col items-center md:items-start">
      <h3
        className="text-[20px] md:text-[30px] font-extrabold leading-[1.15] text-[#0E0E0E]"
        style={{ fontFamily: "" }}
      >
        {cta.heading}
      </h3>
      <p
        className="mt-3 text-[20px] md:text-[20px] leading-[1.3] text-[#B3B6BA] font-normal ml-21 max-w-[500px]"
      >
        {cta.sub}
      </p>
    </div>

    {/* Divider */}
    <div className="hidden md:block  h-25 w-px bg-[#D6D6D8] " aria-hidden />

    {/* Button */}
     <div className="flex items-start justify-start">
      <button
        className="h-12 px-10 md:px-6 rounded-full 
                   bg-[#2c34a1] hover:bg-[#2B34C3] 
                   text-white text-[13px] font-semibold 
                   transition-all duration-200"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {cta.buttonText ?? "Click here to post project"} →
      </button>
    </div>
  </div>
</section>

            {/* Stats Section*/}
            <StatsGrid stats={stats} />

            {/* Cards Section*/}
            <section className="bg-white pb-16">
                <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2 md:px-8">
                    {providers.map((p) => (
                        <ServiceCard key={p.id} provider={p} />
                    ))}
                </div>
            </section>
        </main>
    )
}