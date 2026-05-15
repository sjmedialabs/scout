"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ContactProviderModal from "@/components/leadPopupForm";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle2, Star } from "lucide-react";

export default function Hero({ provider, onContact }: any) {

  const [open, setOpen] = useState(false);

  console.log("Provider data in Hero:", provider);

  return (
    <section className="bg-gradient-to-br from-[#EEF6FF] to-[#F5F7FA] ">
      <div className="px-6 sm:px-6 lg:px-0 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center items-start gap-8">

          {/* MAIN CONTENT AREA */}
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center items-start flex-1 w-full">

            {/* BADGES (MOBILE ONLY - Top of everything) */}
            <div className="flex lg:hidden gap-2 flex-wrap w-full">
              {provider?.isVerified && (
                <Badge className="bg-green-100 text-green-700 rounded-full text-[10px]">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              {provider?.isFeatured && (
                <Badge className="bg-blue-100 text-blue-700 rounded-full text-[10px]">
                  <Star className="h-3 w-3 mr-1 fill-blue-100" />
                  Featured
                </Badge>
              )}
              {provider?.foundedYear && (
                <Badge className="bg-white border text-black rounded-full border-gray-400 text-[10px]">
                  {new Date().getFullYear() - provider.foundedYear} yrs+
                </Badge>
              )}
            </div>

            {/* LOGO SECTION */}
            <div className="flex justify-start lg:justify-center items-start">
              <img
                src={provider?.logo || "/provider4.jpg"}
                alt="logo"
                className="h-20 md:h-40 w-auto max-w-[200px] object-contain"
              />
            </div>

            {/* INFO SECTION */}
            <div className="max-w-3xl flex-1 w-full">
              {/* BADGES (DESKTOP ONLY - Above Title) */}
              <div className="hidden lg:flex gap-2 flex-wrap mb-4">
                {provider?.isVerified && (
                  <Badge className="bg-green-100 text-green-700 rounded-full text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified agency
                  </Badge>
                )}
                {provider?.isFeatured && (
                  <Badge className="bg-blue-100 text-blue-700 rounded-full text-xs">
                    <Star className="h-3 w-3 mr-1 fill-blue-100" />
                    Featured
                  </Badge>
                )}
                {provider?.foundedYear && (
                  <Badge className="bg-white border text-black rounded-full border-gray-500 text-xs">
                    {new Date().getFullYear() - provider.foundedYear} yrs in business
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-2">
                {provider?.name || "Agency Name"}
              </h1>

              {provider?.tagline && (
                <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mb-2">
                  {provider.tagline}
                </h2>
              )}

              {provider?.description && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {provider.description}
                </p>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-row flex-wrap lg:flex-col gap-3 w-full lg:w-auto justify-start items-center lg:items-end  lg:mt-0">
            <Button
              className="primary-button px-6"
              onClick={() => setOpen(true)}
            >
              Contact Provider
            </Button>

            {provider?.website && (
              <a href={provider.website} target="_blank">
                <Button
                  variant="outline"
                  className="btn-blackButton"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Website
                </Button>
              </a>
            )}
          </div>

        </div>

        <ContactProviderModal
          open={open}
          onClose={() => setOpen(false)}
          userId={provider?.userId}
        />

      </div>

    </section>
  );
}