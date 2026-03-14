"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft,  FileText } from "lucide-react";
import { authFetch } from "@/lib/auth-fetch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RequirementDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequirement = async () => {
      try {
        const res = await authFetch(`/api/requirements/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProject(data.requirements[0]);
      } catch (err) {
        console.error("Failed fetching requirement", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRequirement();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        Loading...
      </div>
    );

  if (!project)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        Requirement not found
      </div>
    );

  return (
    <div >

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-md p-3 md:p-5 space-y-2 relative">

        {/* Status Badge */}
        {/* <div className="absolute right-6 top-6">
          <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Active
          </span>
        </div> */}

        {/* Title */}
       <div className="flex flex-row justify-between">
         <h2 className="text-xl md:text-2xl font-semibold text-[#f54a0c]">
           {project.title}
         </h2>
         <div>
            <Badge
            variant="outline"
            className="text-xs text-gray-700 border border-[#DEDEDE] bg-[#EDEDED] rounded-full h-[30px] px-3 flex items-center"
          >
            {project.category}
          </Badge>
         </div>
       </div>

        {/* Grid Info */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="flex  gap-2">
            <label className=" font-bold">
              Budget Range:- 
            </label>
            <div className=" mt-0.5 text-sm  text-gray-700">
              $ {project.budgetMin} - $ {project.budgetMax}
            </div>
          </div>

          <div  className="flex  gap-2">
            <label className=" font-bold">
              Estimated Timeline:- 
            </label>
            <div className="mt-0.5 text-sm text-gray-700">
              {project.timeline}
            </div>
          </div>
        </div>

        {/* Category */}
        {/* <div>
          <label className="text-gray-600 font-medium">
            Category
          </label>
          <div className="mt-0 bg-gray-100 rounded-xl text-sm  px-3 py-4 text-gray-700">
            {project.category}
          </div>
        </div> */}

        {/* Description */}
        <div className="flex gap-2">
          <label className="font-bold">
            Project Description:- 
          </label>
          <div className="mt-0 text-sm text-gray-700">
            {project.description}
          </div>
        </div>

        {/* Attachments */}
        {project.attachmentUrls?.length > 0 && (
          <div>
            <label className=" font-bold">
              Attachments:- 
            </label>

            <div className="mt-2 flex flex-wrap gap-4">
              {project.attachmentUrls.map((url: string, index: number) => (
                <div
                  key={index}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="cursor-pointer flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl hover:bg-gray-200 transition"
                >
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    Download Attachment {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <hr />

        {/* Back Button */}
        <div>
          <button
            onClick={() =>
              router.push("/client/dashboard/projects")
            }
            className="flex items-center text-sm cursor-pointer gap-2 text-gray-600 hover:text-black"
          >
            <ArrowLeft size={14} />
            Back to projects
          </button>
        </div>

      </div>
    </div>
  );
}