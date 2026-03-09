"use client";

import { MoveLeft, File } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

type Props = {
  proposal: any;
  buttonText: string;
  buttonUrl: string;
};

export default function ProposalHeader({
  proposal,
  buttonText,
  buttonUrl,
}: Props) {
    console.log("Recieved Props::::",proposal)
  const router = useRouter();

  const getCountryIso = (countryName?: string) => {
    if (!countryName) return "";
    return countries.getAlpha2Code(countryName, "en")?.toLowerCase() || "";
  };

  return (
    <>
      {/* Requirement Title */}
      <div className="flex flex-row flex-wrap justify-between">
        <h1 className="text-[22px] font-medium text-[#101828]">
          Project Title:
          <span className="text-gray-700">
            {" "}
            {proposal.requirement?.title}
          </span>
        </h1>

        <Button
          className="bg-orangeButton rounded-full h-[30px] mb-3 w-[140px] text-xs lg:text-sm lg:h-[40px] lg:w-[160px]"
          onClick={() => router.push(buttonUrl)}
        >
          <MoveLeft className="h-4 w-4" />
          {buttonText}
        </Button>
      </div>

      {/* Client Details */}
      <div className="flex items-center -mt-4 justify-between flex-wrap gap-6">
        <div className="flex items-center gap-4">
          <img
            src={proposal.client?.image || "/placeholder-logo.png"}
            alt="client-profile"
            className="h-16 w-16 rounded-full object-cover border"
          />

          <div className="space-y-1">
            <div className="flex flex-col items-start sm:flex-row sm:items-center gap-0 sm:gap-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {proposal.client?.companyName}
              </h2>

              <div className="hidden sm:block w-[1px] h-4 bg-gray-400"></div>

              <Badge className="bg-[#eae8f3] text-xs rounded-[8px] text-[#8e90a6]">
                {proposal.requirement.category}
              </Badge>
            </div>

            <div className="flex flex-col items-start sm:flex-row sm:items-center gap-0 sm:gap-3">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                {proposal.client?.country && (
                  <img
                    src={`https://flagcdn.com/24x18/${getCountryIso(
                      proposal.client.country
                    )}.png`}
                    alt="flag"
                    className="w-5 h-4 object-cover rounded-sm border"
                  />
                )}

                <span>
                  +{proposal.client?.countryCode}{" "}
                  {proposal.client?.phoneNumber.slice(
                    proposal.client?.countryCode?.length || 2
                  )}
                </span>
              </p>

              <div className="hidden sm:block w-[1px] h-4 bg-gray-400"></div>

              <p className="text-[#828293] text-xs">
                <span className="font-semibold text-[#000]">Budget: </span>$
                {proposal.requirement.budgetMin} - $
                {proposal.requirement.budgetMax}
              </p>

              <div className="hidden sm:block w-[1px] h-4 bg-gray-400"></div>

              <p className="text-[#828293] text-xs">
                <span className="font-semibold text-[#000]">Timeline: </span>
                {proposal.requirement.timeline}
              </p>
            </div>

            {/* Attachments */}
            {proposal.requirement.attachmentUrls &&
              proposal.requirement.attachmentUrls.length > 0 && (
                <div className="space-y-2 mt-1">
                  <div className="flex flex-row items-center flex-wrap gap-2">
                    {proposal.requirement.attachmentUrls.map(
                      (url: string, index: number) => (
                        <div key={index}>
                          <a
                            href={url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#475467] hover:text-[#1570EF] transition text-xs"
                          >
                            <File size={14} />
                            <span className="underline mt-0.5">
                              Attachement {index + 1}
                            </span>
                          </a>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>

        
      </div>
      {/* Requirement Description */}
        <div>
          <p className="text-xs mt-1 text-[#8b8b97]">
            {proposal.requirement.description}
          </p>
        </div>
    </>
  );
}