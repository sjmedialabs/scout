"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { authFetch } from "@/lib/auth-fetch"

export default function ApplicationsPage() {
  const router = useRouter();
  const params = useParams()
  const slug = params.slug as string

  const [apps, setApps] = useState<any[]>([])

  useEffect(() => {
    if (!slug) return

    authFetch(`/api/applications/${slug}`)
      .then((res) => res.json())
      .then(setApps)
  }, [slug])

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
          <Button className="BackButton h-[30px]" onClick={()=>router.back()}>
               Back
          </Button>
       </div>

      <div className=" grid grid-cols-1 lg:grid-cols-2  gap-3">
        {apps.map((app) => (
          <Card key={app._id} className="px-3 py-4 rounded-2xl bg-white shadow-md">
            
              {/* LEFT */}
              <div className="space-y-1">
                <h2 className="font-semibold text-lg text-orangeButton">
                  {app.firstName} {app.lastName}
                </h2>

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

                <div className="flex gap-2">
                  <Button
                    onClick={() => updateStatus(app._id, "accepted")}
                     className="bg-[#39A935] h-[30px] rounded-full text-xs font-bold hover:bg-[#39A935] active:bg-[#39A935]"
                  >
                    Accept
                  </Button>

                  <Button
                    onClick={() => updateStatus(app._id, "rejected")}
                    className="bg-[#FF0000]  h-[30px] rounded-full text-xs font-bold hover:bg-[#FF0000] active:bg-[#FF0000]"
                  >
                    Reject
                  </Button>
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
