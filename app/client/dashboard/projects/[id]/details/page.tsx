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
         <h1 className="text-xl md:text-3xl font-semibold text-gray-800">
           {project.title}
         </h1>
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

          <div>
            <label className="text-gray-600 font-medium">
              Budget Range ($)
            </label>
            <div className="mt-0 bg-gray-100 rounded-xl text-sm  px-3 py-4 text-gray-700">
              $ {project.budgetMin} - $ {project.budgetMax}
            </div>
          </div>

          <div>
            <label className="text-gray-600 font-medium">
              Estimated Timeline
            </label>
            <div className="mt-0 bg-gray-100 rounded-xl text-sm  px-3 py-4 text-gray-700">
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
        <div>
          <label className="text-gray-600 font-medium">
            Project Description
          </label>
          <div className="mt-0 bg-gray-100 rounded-xl text-sm  px-3 py-4 text-gray-700">
            {project.description}
          </div>
        </div>

        {/* Attachments */}
        {project.attachmentUrls?.length > 0 && (
          <div>
            <label className="text-gray-600 font-medium">
              Attachments
            </label>

            <div className="mt-4 flex flex-wrap gap-4">
              {project.attachmentUrls.map((url: string, index: number) => (
                <div
                  key={index}
                  onClick={() => window.open(url, "_blank")}
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
            className="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to projects
          </button>
        </div>

      </div>
    </div>
  );
}