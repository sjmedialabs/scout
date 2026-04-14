"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { authFetch } from "@/lib/auth-fetch"
import { Button } from "@/components/ui/button"
import { useMemo } from "react"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"

export default function AdminCareersPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [counts, setCounts] = useState<any[]>([])
  const [editingJob, setEditingJob] = useState<any>(null)



  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    email: "",
    website: "",
    experience: "",
    salaryRange: "",
    department: "",
    employmentType: "",
  })

  const [responsibilities, setResponsibilities] = useState("")
  const [skills, setSkills] = useState("")

  useEffect(() => {
    authFetch("/api/careers")
      .then((res) => res.json())
      .then(setJobs)
  }, [])

  useEffect(() => {
  authFetch("/api/applications/count")
    .then(res => res.json())
    .then(setCounts)
}, [])

const getCount = (title: string) => {
  const found = counts.find((c) => c._id === title)
  return found ? found.count : 0
}

const deleteJob = async (id: string) => {
  await authFetch("/api/admin/careers/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })

  setJobs((prev) => prev.filter((j) => j._id !== id))
}


const openEdit = (job: any) => {
    setEditingJob(job)
    setFormData({
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      email: job.email || "",
      website: job.website || "",
      experience: job.experience || "",
      salaryRange: job.salaryRange || "",
      department: job.department || "",
      employmentType: job.employmentType || "",
    })
    setResponsibilities(job.responsibilities || "")
    setSkills(job.skills || "")
    setOpenModal(true)
  }

  const modules = useMemo(() => ({
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link"],
    ["clean"],
  ],
}), [])

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
]




  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

   const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      email: "",
      website: "",
      experience: "",
      salaryRange: "",
      department: "",
      employmentType: "",
    })
    setResponsibilities("")
    setSkills("")
    setEditingJob(null)
  }

  const handleSubmit = async () => {
  try {
    setLoading(true)

    const payload = {
      ...formData,
      responsibilities,
      skills,
    }

    // EDIT MODE
    if (editingJob) {
      const res = await authFetch("/api/admin/careers/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingJob._id,
          data: payload,
        }),
      })

      const updatedJob = await res.json()

      setJobs((prev) =>
        prev.map((j) => (j._id === updatedJob._id ? updatedJob : j))
      )
    } else {
      const res = await authFetch("/api/admin/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const newJob = await res.json()
      setJobs([newJob, ...jobs])
    }

    resetForm()
    setOpenModal(false)
  } catch {
    alert("Failed to save job")
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="p-0 max-w-7xl">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-1">
        <div>
          <h1 className="font-bold text-orangeButton text-xl ">
            Job Listing
          </h1>
          <p className="text-md">Listed Jobs</p>
        </div>

      <Button
          onClick={() => {
            resetForm()
            setOpenModal(true)
          }}
          className="btn-blackButton h-[30px]"
        >
          Post Job
        </Button>
      </div>

      {/* JOB LIST */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job._id} className="py-2 px-4 rounded-2xl bg-white shadow-md">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <Link href={`/admin/careers/${job.slug}`}>
              <div>
                <h2 className="font-semibold text-lg cursor-pointer">
                  {job.title}
                </h2>
            
            <div className="flex gap-4 mt-2">
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Department:</span> {job.department}
            </p>

            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Employment Type:</span> {job.employmentType}
            </p>

            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Location:</span> {job.location}
            </p>
          </div>


              {/* <span className="inline-block mt-2 text-xs bg-green-400 text-white px-2 py-1 rounded-full">
                Applications: {getCount(job.title)}
              </span> */}
            </div>
            </Link>

            <div className="flex gap-2">
            <Button
            className="btn-blackButton h-[30px]"
              variant="outline"
              onClick={() => openEdit(job)}
            >
              Edit
            </Button>

            <Button
            className="primary-button h-[30px]"
              variant="destructive"
              onClick={() => deleteJob(job._id)}
            >
              Delete
            </Button>
          
            
                <Button className="btn-blackButton h-[30px]" onClick={()=>router.push(`/admin/careers/${job.title}/applications`)}>Applications:({getCount(job.title)})</Button>
              
            </div>
            </div>
            
          </Card>
        ))}
        {jobs.length===0 &&(
          <p className="text-center text-gray-500 py-10">No jobs posted yet.</p>
        )}
      </div>

      {/* POST JOB MODAL */}
      {openModal && (
          <div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
            onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpenModal(false)
            }
          }}
          >
            <div
              className="bg-white rounded-xl  py-4 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
            <CardHeader>
              <CardTitle className="text-xl text-orangeButton">
                {editingJob ? "Edit Job" : "Post Job"}
              </CardTitle>

              <button
              onClick={() => setOpenModal(false)}
              className="absolute top-6 right-6 text-gray-500 cursor-pointer"
            >
              ✕
            </button>

            </CardHeader>

            <CardContent className="space-y-6">
             <div>
               <Label className="text-[#000] text-sm font-medium mb-0">Title</Label>
              <Input 
              className="rounded-xl shadow-md border-gray-200 placeholder:text-gray-500"
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="Enter Job Title" />
             </div>
              
              <div>
                <Label className="text-[#000] text-sm font-medium mb-0">Description</Label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full  shadow-md border rounded-xl p-3"
                placeholder="Enter JobDescription"
              />
              </div>
 
              <div>
                <Label className="text-[#000] text-sm font-medium mb-0">Location</Label>
              <Input
              className="rounded-xl shadow-md border-gray-200 placeholder:text-gray-500"
               name="location" 
               value={formData.location} 
               onChange={handleChange} 
               placeholder="Enter Job Location" 
               />
               </div>
               <div>
                <Label className="text-[#000] text-sm font-medium mb-0">Email</Label>
              <Input 
              className="rounded-xl shadow-md border-gray-200 placeholder:text-gray-500"
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Enter Your Email" 
              />
              </div>
              {/* <Input 
              className="rounded-xl shadow-md border-gray-200 placeholder:text-gray-500"
              name="website" 
              value={formData.website} 
              onChange={handleChange} 
              placeholder="Website" 
              /> */}

              <div>
                <Label className="text-[#000] text-sm font-medium mb-0">Responsibilities</Label>

              <ReactQuill
                className="rounded-xl placeholder:text-gray-300 shadow-md border-gray-200"
                value={responsibilities}
                placeholder="Enter Key Responsibilities"
                onChange={setResponsibilities}
                modules={modules}
                formats={formats}
              />
              </div>

              <div>
                <Label className="text-[#000] text-sm font-medium mb-0">Skills</Label>
          

              <ReactQuill
                className="rounded-xl shadow-md border-gray-200"
                value={skills}
                placeholder="Enter Requried Skills & Capabilities"
                onChange={setSkills}
                modules={modules}
                formats={formats}
              />
              </div>

              <div>
                <Label className="text-[#000] text-sm font-medium mb-0">Experience</Label>
              <Input 
              className="rounded-xl shadow-md border-gray-200 placeholder:text-gray-500"
              name="experience" 
              value={formData.experience}
               onChange={handleChange} 
               placeholder="Experience" 
               />
                </div>
              <div>
                <Label className="text-[#000] text-sm font-medium mb-0">Salary Range</Label>
              <Input 
              className="rounded-xl shadow-md border-gray-200 placeholder:text-gray-500"
              name="salaryRange" 
              value={formData.salaryRange} 
              onChange={handleChange} 
              placeholder="Salary" 
              />
              </div>
              
              <div>
                <Label className="text-[#000] text-sm font-medium mb-0">Department</Label>
             
              <Input 
              className="rounded-xl shadow-md border-gray-200 placeholder:text-gray-500"
              name="department" 
              value={formData.department} 
              onChange={handleChange} 
              placeholder="Department" 
              />
               </div>
               <div>
                <Label className="text-[#000] text-sm font-medium mb-0">Employment Type</Label>
               
              <Input 
              className="rounded-xl shadow-md border-gray-200 placeholder:text-gray-500"
              name="employmentType" 
              value={formData.employmentType} 
              onChange={handleChange} 
              placeholder="Employment Type" 
              />
              </div>
               
               <div className="flex gap-3">
              <Button 
              onClick={handleSubmit} 
              disabled={loading} 
              className="primary-button h-[30px]">
                {loading ? "Saving..." : editingJob ? "Update Job" : "Post Job"}
              </Button>

              <Button 
              className="btn-blackButton h-[30px]"
              variant="outline" 
              onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
              </div>
            </CardContent>
          </div>
        </div>
      )}
    </div>
  )
}
