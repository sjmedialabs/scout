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
    <section className="bg-white px-6 sm:px-6 lg:px-0 py-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center items-start gap-5">

        <div className="flex gap-6 items-start flex-1">

        {/* LOGO SECTION  */}
        <div className="flex justify-start lg:justify-center items-start">
        <img
          src={provider?.logo || "/provider4.jpg"}
          alt="logo"
          className="h-20 md:h-40 w-auto max-w-[200px] object-contain"
        />
      </div>

        {/* LEFT CONTENT */}
        <div className="max-w-3xl flex-1">
          <div className="flex gap-2 flex-wrap mb-4">

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
              <Badge className="bg-white border text-black rounded-full border border-gray-500 text-xs">
                {new Date().getFullYear() - provider.foundedYear} yrs in business
              </Badge>
            )}

          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-0">
            {provider?.name || "Agency Name"}
          </h1>

          {provider?.tagline && (
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-0">
              {provider.tagline}
            </h2>
          )}

          {/* {provider?.description && (
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              {provider.description}
            </p>
          )} */}

          <div className="flex flex-wrap gap-3 mt-6">

            <Button
              className="primary-button"
              onClick={() => setOpen(true)}
            >
              Get a Quote
            </Button>

            <Button
              variant="outline"
              className="btn-blackButton"
              onClick={() => {
                const section = document.getElementById("case-studies");
                if (section) {
                  const yOffset = -100;
                  const y =
                    section.getBoundingClientRect().top + window.pageYOffset + yOffset;

                  window.scrollTo({
                    top: y,
                    behavior: "smooth",
                  });
                }
              }}
            >
              View Case Studies
            </Button>

          </div>
        </div>
        </div>

        {/* RIGHT BUTTONS  */}
        <div className="flex flex-col gap-3 justify-center items-start lg:items-end">

          <Button
            className="primary-button"
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

    </section>
  );
}