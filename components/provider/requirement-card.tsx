"use client";
import { Clock, MapPin, Briefcase, DollarSign } from "lucide-react";
import {useRouter} from "next/navigation";
import { Button } from "@/components/ui/button";

interface Client {
  companyName?: string;
  phoneNumber?: string;
  country?: string;
  image?: string;
}

interface Attachment {
  name: string;
  url: string;
}

interface Requirement {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  budgetMin?: number;
  budgetMax?: number;
  duration?: string;
  category?: string;
  country?: string;
  skills?: string[];
  attachments?: Attachment[];
  client?: Client;
  createdAt: string;
}

interface Props {
  data: Requirement;
  isProposalSubmitted:boolean;
}

export default function RequirementCard({ data,isProposalSubmitted }: Props) {
    const router=useRouter();
  return (
    <div className="w-full bg-white border rounded-xl shadow-sm p-6 space-y-5"  key={data._id}>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {data.title}
          </h2>

          <p className="text-sm text-gray-500">
            Posted {getTimeAgo(data.createdAt)}
          </p>
        </div>

        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
          Open
        </span>
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-6 text-sm text-gray-600">

        <div className="flex items-center gap-2">
          <DollarSign size={16} />
          {data.budgetMin} -  {data.budgetMax}
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} />
          {data.timeline}
        </div>

        <div className="flex items-center gap-2">
          <Briefcase size={16} />
          {data.category}
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={16} />
          {data?.client?.country || "India"}
        </div>

      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">
          Project Description
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed">
          {data.description}
        </p>
      </div>

      {/* Requirements */}
      {/* {data.requirements?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Requirements
          </h3>

          <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
            {data.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      )} */}

      {/* Skills */}
      {/* {data.skills?.length > 0 && (
        <div className="flex flex-wrap gap-2">

          {data.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}

        </div>
      )} */}

      {/* Attachments */}
      {data.attachmentUrls?.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">
            Attachments
          </h3>

          <div className="space-y-2">

            {data.attachmentUrls.map((file, index) => (
              <div
                key={index}
                className="flex justify-between items-center border rounded-lg px-4 py-3 bg-gray-50"
              >
                <span className="text-sm text-gray-700">
                  document {index + 1}
                </span>

                <a
                  href={file}
                  download
                  className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100"
                >
                  Download
                </a>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t">

        <span className="text-sm text-gray-500">
          {data.proposals} agencies already applied
        </span>

        <div className="flex gap-3">

          <Button className="btn-blackButton h-[30px]" onClick={()=>router.back()}>
            Back
          </Button>

          {Boolean(isProposalSubmitted) ? (
                    <span className="inline-block px-8 cursor-not-allowed py-2 text-xs font-medium rounded-full bg-gray-200 text-gray-600">
                      Submitted
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      className="primary-button"
                      onClick={() =>
                        router.push(
                          `/agency/dashboard/project-inquiries/${data._id}`
                        )
                      }
                    >
                      Submit Proposal
                    </Button>
                  )}

        </div>

      </div>

    </div>
  );
}

function getTimeAgo(dateString: string) {
  const now = new Date();
  const created = new Date(dateString);

  const diff = Math.floor(
    (now.getTime() - created.getTime()) / 1000
  );

  const hours = Math.floor(diff / 3600);

  if (hours < 1) return "just now";
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);

  return `${days} days ago`;
}