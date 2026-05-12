"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { authFetch } from "@/lib/auth-fetch"

export default function ApplicationsPage() {
  const router = useRouter();
  const params = useParams()
  const jobId = params.jobId as string

  const [apps, setApps] = useState<any[]>([])

  useEffect(() => {
    if (!jobId) return

    authFetch(`/api/applications/${jobId}`)
      .then((res) => res.json())
      .then(setApps)
  }, [jobId])

  const updateStatus = async (id: string, status: string) => {
    await authFetch("/api/applications/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })

    setApps((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status } : a))
    )
  }

  return (
    <div className="max-w-6xl">

      <div className="flex justify-between">
        <h1 className="text-xl font-bold text-orangeButton mb-2">
          Applications
        </h1>
        <Button className="BackButton h-[30px]" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <div className=" grid grid-cols-1 lg:grid-cols-2  gap-3">
        {apps.map((app) => (
          <Card key={app._id} className="px-3 py-4 rounded-2xl bg-white shadow-md">

            {/* LEFT */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <h2 className="font-semibold text-lg text-orangeButton">
                  {app.firstName} {app.lastName}
                </h2>

                <span className={`text-[10px] font-bold px-2 items-center text-center py-1.5 rounded-full ${app.status === "selected" ? "bg-green-100 text-green-700" :
                  app.status === "rejected" ? "bg-red-100 text-red-700" :
                    app.status === "shortlisted" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                  }`}>
                  {app.status?.toUpperCase() || "PENDING"}
                </span>
              </div>


              <div className="flex flex-row gap-4">

                <div className="">
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">Email:</span> {app.email}
                  </p>


                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">Qualification:</span> {app.qualification}
                  </p>
                </div>

                <div className="">
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">Phone:</span> {app.phone}
                  </p>

                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">Experience:</span> {app.experience}
                  </p>
                </div>


              </div>


              {/* Resume Section */}
              <div className="mt-1">
                {/* <p className="font-medium">Resume</p> */}

                <div className="flex items-center gap-3 mt-2">
                  {/* <FileText className="text-orange-600" size={28} /> */}

                  <div className="flex gap-2">
                    {/* <a href={app.resumeUrl} target="_blank">
                        <Button
                        className="btn-blackButton h-[30px]" variant="outline">Resume</Button>
                    </a> */}

                    <a href={app.resumeUrl} download>
                      <Button
                        className="primary-button h-[30px]" variant="outline">Resume</Button>
                    </a>
                  </div>
                  {/*these are visisble at below sm devices */}

                  <div className="flex items-center gap-2">


                    <Select
                      value={app.status || "pending"}
                      onValueChange={(val) => updateStatus(app._id, val)}
                    >
                      <SelectTrigger className="w-[110px] !h-[30px] text-[12px] rounded-full border border-gray-300">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="selected">Selected</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>


            </div>



          </Card>
        ))}
      </div>
    </div>
  )
}
