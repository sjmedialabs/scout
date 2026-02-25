
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import PdfUpload from "../pdfUpload"
import { toast } from "@/lib/toast"
import ServiceDropdown from "../select-category-filter"
import { ChevronRight } from "lucide-react"
import { Send } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface PostRequirementFormProps {
  onSubmit: (requirement: any) => void
  sendingStatus: boolean
}

export function PostRequirementForm({
  onSubmit,
  sendingStatus,
}: PostRequirementFormProps) {

  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    category: "",
    budgetMin: "",
    budgetMax: "",
    documentUrl: [],
    timeline: "",
  })

  useEffect(() => {
    if (sendingStatus) {
      setFormData({
        title: "",
        image: "",
        description: "",
        category: "",
        budgetMin: "",
        budgetMax: "",
        documentUrl: [],
        timeline: "",
      })
      setStep(1)
    }
  }, [sendingStatus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.title.trim() ||
      !formData.category ||
      !formData.description.trim() ||
      !formData.budgetMin.trim() ||
      !formData.budgetMax.trim()
    ) {
      toast.error("All Fields are required except document")
      return
    }

    if (Number(formData.budgetMin) > Number(formData.budgetMax)) {
      toast.error("Minimum budget should be less than Maximum budget")
      return
    }

    const payload = {
      title: formData.title.trim(),
      image: formData.image,
      category: formData.category,
      description: formData.description.trim(),
      budgetMin: Number(formData.budgetMin),
      budgetMax: Number(formData.budgetMax),
      attachmentUrls: formData.documentUrl,
      timeline: formData.timeline.trim(),
    }

    onSubmit(payload)
  }

 const StepTab = ({
  number,
  title,
  step,
  setStep,
}: {
  number: number;
  title: string;
  step: number;
  setStep: (step: number) => void;
}) => {
  const isActive = step === number;

  return (
    <div className="flex flex-1 items-center relative">
      <button
        type="button"
        onClick={() =>{
          if(number===2){
            if(!formData.title.trim() || !formData.description.trim() || !formData.category){
              toast.error("Title, description and category are required")
              return
            }
          }
          if(number===3){
            if(!formData.budgetMin || !formData.budgetMax || !formData.timeline.trim()){
              toast.error("Budget and timeline fields are required")
              return
            }
          }
           setStep(number)
        }}
        className={`relative z-10 flex-1 py-4 pl-0 pr-3 md:pl-6 md:pr-6  text-sm font-medium transition-all duration-300 flex items-center gap-2
          ${
            isActive
              ? "text-white"
              : "text-slate-500"
          }`}
        style={
          isActive
            ? {
                background: "#e0332c",
                clipPath: number !== 3
                  ? "polygon(0 0, 100% 0, 82% 100%, 0% 100%)"
                  : "none",
                // clipPath: {`${number!==3?"polygon(0 0, 100% 0, 82% 100%, 0% 100%)":""}`}},
                borderRadius: "12px 0 0 12px",
              }
            : undefined
        }
      >
        {/* <span className="font-bold">{number}</span> */}
        <span className="whitespace-nowrap">{title}</span>
      </button>

      {/* {number < 3 && (
        <div className="absolute right-[-10%] top-1/2 w-1/5 h-[1px] bg-slate-300 -translate-y-1/2 z-0" />
      )} */}
    </div>
  );
};


const steps = [
    { number: 1, title: "Step 1: Basic" },
    { number: 2, title: "Step 2: Budget" },
    { number: 3, title: "Step 3: Attachments" }, // Fixed typo from your screenshot
  ];

console.log("Form Data Url is:::",formData.documentUrl)

  
  return (
    <div className="-ml-3 -mt-13">
      <div className="max-w-7xl bg-[#fff]">

        <h1 className="text-xl text-[#F54A0C] font-bold">
          Post New Requirement
        </h1>
        <p className="text-sm text-[#656565] font-light mb-3">
          Describe your project needs to receive proposals
        </p>

        <div className="w-full max-w-7xl  p-0 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-sm flex items-center overflow-hidden">
      {steps.map((s) => (
        <StepTab
          key={s.number}
          number={s.number}
          title={s.title}
          step={step}
          setStep={setStep}
        />
      ))}
    </div>

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="bg-[#fff] space-y-6 rounded-xl p-6 mt-5 shadow-md shadow-gray-300">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label className="text-gray-400 font-semibold text-[14px]">
                  Project Title
                </Label>
                <Input
                  value={formData.title}
                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-gray-400"
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="Enter project title"
                />
              </div>

              <div className="flex-1">
                <Label className="text-gray-400 font-semibold text-[14px]">
                  Category
                </Label>
                <ServiceDropdown
                  value={formData.category}
                  onChange={(value) =>
                    setFormData((p) => ({ ...p, category: value }))
                  }
                  placeholder="Select service"
                  triggerClassName="border-2 border-[#D0D5DD] text-[#000] rounded-[8px] p-4
                      text-xs"
                  triggerSpanClassName="text-[#000]"
                />
              </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400 font-semibold text-[14px]">
                  Project Description
                </Label>
                <Textarea
                  rows={6}
                  value={formData.description}
                  placeholder="Enter description"
                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-gray-400"
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="bg-[#fff] space-y-6 rounded-xl p-6 mt-5 shadow-md shadow-gray-300">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label className="text-gray-400 font-semibold text-[14px]">
                    Budget (Min)
                  </Label>
                  <Input
                    type="number"
                    value={formData.budgetMin}
                    placeholder="Enter minimum budget"
                    className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-gray-400"
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        budgetMin: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex-1">
                  <Label className="text-gray-400 font-semibold text-[14px]">
                    Budget (Max)
                  </Label>
                  <Input
                    type="number"
                    value={formData.budgetMax}
                    placeholder="Enter maximum budget"
                    className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-gray-400"
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        budgetMax: e.target.value,
                      }))
                    }
                  />
                </div>

                 <div className="flex-1">
                <Label className="text-gray-400 font-semibold text-[14px]">
                  Expected Timeline
                </Label>

                <div className="flex gap-3">
                  
                  {/* Number Input */}
                  <Input
                    type="number"
                    min={1}
                    placeholder="Enter Timeline"
                    className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-gray-400 w-40"
                    onChange={(e) => {
                      const value = e.target.value
                      const unit = formData.timeline.split(" ")[1] || "days"

                      setFormData((p) => ({
                        ...p,
                        timeline: value
                          ? `${value} ${Number(value) === 1 ? unit.replace(/s$/, "") : unit}`
                          : "",
                      }))
                    }}
                  />

                  {/* Unit Dropdown */}
                 <Select
                    defaultValue="days"
                    onValueChange={(unit) => {
                      const value = formData.timeline.split(" ")[0] || "1"

                      setFormData((p) => ({
                        ...p,
                        timeline: `${value} ${
                          Number(value) === 1 ? unit.replace(/s$/, "") : unit
                        }`,
                      }))
                    }}
                  >
                    <SelectTrigger
                      className="
                        border-2 border-[#D0D5DD]
                        rounded-[8px]
                        px-3
                        text-sm
                        bg-white
                        h-10
                        w-[120px]
                        focus:ring-0
                        focus:outline-none
                      "
                    >
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent className="text-sm">
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="years">Years</SelectItem>
                    </SelectContent>
                  </Select>

                </div>
              </div>
              </div>

              {/* <div>
                <Label className="text-[#98A0B4] text-[14px]">
                  Expected Timeline
                </Label>
                <Input
                  value={formData.timeline}
                  placeholder="Enter expected timeline"
                  className="border-2 border-[#D0D5DD] placeholder:text-gray-400"
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      timeline: e.target.value,
                    }))
                  }
                />
              </div> */}

              {/* Timeline */}
             
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="bg-[#fff] space-y-6 rounded-xl p-6 mt-5 shadow-md shadow-gray-300">
              <div className="space-y-2">
                <Label className="text-gray-400 font-semibold text-[14px]">
                  Project Attachment (optional)
                </Label>

                <PdfUpload
                  maxSizeMB={10}
                  onUploadSuccess={(url) =>
                    setFormData((p) => ({
                      ...p,
                      documentUrl: [...p.documentUrl, url],
                    }))
                  }
                />
              </div>
              <div>
             <Button
                type="submit"
                className="
                  group
                  w-auto
                  px-8
                  h-14
                  rounded-2xl
                  text-white
                  text-lg
                  font-semibold
                  flex
                  items-center
                  gap-3
                  bg-gradient-to-r
                  from-[#e0332c]
                  via-[#dc514c]
                  to-[#ca251f]
                  shadow-md
                  hover:shadow-lg
                  transition-all
                  duration-300
                "
              >
                <Send className="h-5 w-5 text-white opacity-90" />

                <span className="tracking-wide">
                  Publish Requirement
                </span>

                <ChevronRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              </div>
            </div>
          )}

          {/* STEP NAVIGATION (ONLY ADDITION) */}
          <div className="flex justify-between pt-0">
            {step > 1 ? (
              <Button
                type="button"
                className="rounded-xl bg-black h-8 text-white hover:bg-[#464646]"
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 && (
              <Button
                type="button"
                className="rounded-xl bg-black h-8"
                 onClick={() =>{
                    if(step===1){
                      if(!formData.title.trim() || !formData.description.trim() || !formData.category){
                        toast.error("Title, description and category are required")
                        return
                      }
                    }
                    if(step===2){
                      if(!formData.budgetMin || !formData.budgetMax || !formData.timeline.trim()){
                        toast.error("Budget and timeline fields are required")
                        return
                      }
                    }
                    setStep((s) => s + 1)
                  }}
                
              >
                Next
              </Button>
            )}
          </div>

          {/* ORIGINAL FOOTER (UNCHANGED) */}

          {/* <div className="flex gap-4 pt-0">
            <Button type="button" variant="outline" 
            className="flex-1 rounded-xl">
              Save Draft
            </Button>

            <Button type="button" variant="outline" 
            className="flex-1 rounded-xl">
              Cancel
            </Button>
          </div> */}

        </form>
      </div>
    </div>
  )
}


// "use client"

// import type React from "react"

// import { useState,useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Upload, X } from "lucide-react"
// import { categories } from "@/lib/mock-data"
// import FileUpload from "../file-upload"
// import PdfUpload from "../pdfUpload"
// import { toast } from "@/lib/toast"
// import ServiceDropdown from "../select-category-filter"

// interface PostRequirementFormProps {
//   onSubmit: (requirement: any) => void
//   sendingStatus:boolean
  
// }

// export function PostRequirementForm({ onSubmit,sendingStatus}: PostRequirementFormProps) {
//   const [formData, setFormData] = useState({
//     title: "",
//     image: "",
//     description: "",
//     category: "",
//     budgetMin: "",
//     budgetMax: "",
//     documentUrl:"",
//     timeline: "",
//   })
  
//    // ✅ RESET FORM ONLY WHEN sendingStatus CHANGES TO TRUE
//   useEffect(() => {
//     if (sendingStatus) {
//       setFormData({
//         title: "",
//         image: "",
//         description: "",
//         category: "",
//         budgetMin: "",
//         budgetMax: "",
//         documentUrl: "",
//         timeline: "",
//       })
//     }
//   }, [sendingStatus])
  
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     if(!formData.title.trim() || !formData.category || !formData.description.trim() || !formData.budgetMin.trim() || !formData.budgetMax.trim()){
//       toast.error("All Fields are required except document")
//       return
//     }
//     if(Number(formData.budgetMin)>Number(formData.budgetMax)){
//       toast.error("Minimum budget should be greater than the Maximum budget")
//       return
//     }

//     //Build correct payload for API
//     const payload = {
//       title: formData.title.trim(),
//       image: formData.image,
//       category: formData.category,
//       description: formData.description.trim(),
//       budgetMin: Number(formData.budgetMin),
//       budgetMax: Number(formData.budgetMax),
//       documentUrl:formData.documentUrl,
//       timeline: formData.timeline.trim(),
//     }

//     onSubmit(payload)
//     // console.log("Requirement submitted:", formData)
//   }

//   console.log("Form Data :::::;",formData)

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setAttachments((prev) => [...prev, ...Array.from(e.target.files!)])
//     }
//   }

//   const removeAttachment = (index: number) => {
//     setAttachments((prev) => prev.filter((_, i) => i !== index))
//   }

//   return (
//     <div className="my-custom-class">
//       <div className="max-w-2xl bg-[#fff]">
      
//         <h1 className="text-3xl text-[#F54A0C] font-bold tracking-tight">
//           Post New Requirement
//           </h1>
//         <p className="text-xl text-[#656565] font-light mb-8">
//           Describe your project needs to receive proposals from qualified providers
//           </p>
      
//       <div>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="title" className="text-[#98A0B4] text-[14px] font-normal">Project Title</Label>
//             <Input
//               id="title" 
//               value={formData.title}
//               className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
            
//               onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
//               placeholder="e.g., E-commerce Website Development"
//               required
//             />
//           </div>
//           {/*categories */}
//           {/* <div className="space-y-2">
//             <Label htmlFor="category" className="text-[#98A0B4] text-[14px] font-normal">Category</Label>
//            <Select
//             value={formData.category}
//             onValueChange={(value) =>
//               setFormData((prev) => ({ ...prev, category: value }))
//             }
//           >
//             <SelectTrigger
//               className="
//                 border-2 border-[#D0D5DD] rounded-[8px]
//                 data-[placeholder]:text-[#98A0B4]
                
//                 text-[#000]
//               "
//             >
//               <SelectValue placeholder="Select a category" style={{color:"#98A0B4"}} />
//             </SelectTrigger>

//             <SelectContent>
//               {categories.map((category) => (
//                 <SelectItem key={category} value={category}>
//                   {category}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           </div> */}

//            <div className="space-y-2">
//                 <Label
//                   htmlFor="category"
//                   className="text-[#000]  text-[14px] font-bold"
//                 ></Label>

//                 <ServiceDropdown
//                 value={formData.category}
//                   onChange={(value)=> setFormData((prev) => ({ ...prev, category: value }))}
//                   triggerClassName="border-2 border-[#D0D5DD] rounded-[8px] data-[placeholder]:text-[#98A0B4] text-[#000] p-4"
//                 />
//           </div>
          

//           <div className="space-y-2">
//             <Label htmlFor="description" className="text-[#98A0B4] text-[14px] font-normal">Project Description</Label>
//             <Textarea
//               id="description"
//               className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
//               value={formData.description}
//               onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
//               placeholder="Provide detailed information about your project requirements, goals, and expectations..."
//               rows={6}
//               required
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="budgetMin" className="text-[#98A0B4] text-[14px] font-normal">Budget Range (Min)</Label>
//               <Input
//                 id="budgetMin"
//                 type="number"
//                 value={formData.budgetMin}
//                 className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
//                 onChange={(e) => setFormData((prev) => ({ ...prev, budgetMin: e.target.value }))}
//                 placeholder="1000"
//                 required
//               />
//             </div>
//             <div className="space-y-2"  >
//               <Label htmlFor="budgetMax" className="text-[#98A0B4] text-[14px] font-normal">Budget Range (Max)</Label>
//               <Input
//                 id="budgetMax"
//                 type="number"
//                 value={formData.budgetMax}
//                 className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
//                 onChange={(e) => setFormData((prev) => ({ ...prev, budgetMax: e.target.value }))}
//                 placeholder="5000"
//                 required
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="timeline" className="text-[#98A0B4] text-[14px] font-normal">Expected Timeline</Label>
//             <Input
//               id="timeline"
//               value={formData.timeline}
//                className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
//               onChange={(e) => setFormData((prev) => ({ ...prev, timeline: e.target.value }))}
//               placeholder="e.g., 3 months, 8 weeks"
//               required
//             />
//           </div>
//           <div className="space-y-2">
//            <Label className="text-[#98A0B4] text-[14px] font-normal">Project Attachment (optional)</Label>
//            <PdfUpload
//         maxSizeMB={10}
//         onUploadSuccess={(url) =>
//           setFormData((prev) => ({
//             ...prev,
//             documentUrl: url,
//           }))
//         }
//       />
//           </div>
          


//           <div className="flex gap-4 pt-4">
//             <Button type="submit" className="flex-1">
//               Post Requirement
//             </Button>
            
//           </div>
//         </form>
//       </div>
//     </div>
//     </div>
//   )
// }
