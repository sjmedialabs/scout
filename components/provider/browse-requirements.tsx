"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CiFilter } from "react-icons/ci"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Requirement } from "@/lib/types"
import ServiceDropdown from "../select-category-filter"
import { MobileFilterBar } from "@/components/layout";

interface BrowseRequirementsProps {
  requirements: Requirement[]
  
}

export function BrowseRequirements({
  requirements,
  
}: BrowseRequirementsProps) {
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState<number | undefined>()
  const [serviceFilter, setServiceFilter] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [filteredRequirements, setFilteredRequirements] =
    useState<Requirement[]>(requirements)

  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  // const handleSearch = () => {
  //   let tempFilteredRequirements = [...requirements]

  
  //   if (searchTerm) {
  //     tempFilteredRequirements = tempFilteredRequirements.filter(
  //       (eachItem) => eachItem?.budgetMin > searchTerm
  //     )
  //   }

  
  //   if (serviceFilter && serviceFilter.toLowerCase() !== "all") {
  //     tempFilteredRequirements = tempFilteredRequirements.filter(
  //       (eachItem) =>
  //         eachItem.category.toLowerCase() ===
  //         serviceFilter.toLowerCase()
  //     )
  //   }

    
  //   if (startDate) {
  //     tempFilteredRequirements = tempFilteredRequirements.filter(
  //       (eachItem) =>
  //         new Date(eachItem.createdAt) >= new Date(startDate)
  //     )
  //   }

    
  //   if (endDate) {
  //     tempFilteredRequirements = tempFilteredRequirements.filter(
  //       (eachItem) =>
  //         new Date(eachItem.createdAt) <= new Date(endDate)
  //     )
  //   }

  //   setFilteredRequirements(tempFilteredRequirements)
  //   setCurrentPage(1)
  // }

  useEffect(()=>{
    let tempFilteredRequirements = [...requirements]

    // Remove already submitted proposals
      // tempFilteredRequirements = tempFilteredRequirements.filter(
      //   (eachItem) => !eachItem.isProposalSubmitted 
      // )

    // Budget Filter
    if (searchTerm) {
      tempFilteredRequirements = tempFilteredRequirements.filter(
        (eachItem) => eachItem?.budgetMin > searchTerm
      )
    }

    // Service Filter
    if (serviceFilter && serviceFilter.toLowerCase() !== "all") {
      tempFilteredRequirements = tempFilteredRequirements.filter(
        (eachItem) =>
          eachItem.category.toLowerCase() ===
          serviceFilter.toLowerCase()
      )
    }

    // Start Date Filter
    if (startDate) {
      tempFilteredRequirements = tempFilteredRequirements.filter(
        (eachItem) =>
          new Date(eachItem.createdAt) >= new Date(startDate)
      )
    }

    // End Date Filter
    if (endDate) {
      tempFilteredRequirements = tempFilteredRequirements.filter(
        (eachItem) =>
          new Date(eachItem.createdAt) <= new Date(endDate)
      )
    }

    setFilteredRequirements(tempFilteredRequirements)
    setCurrentPage(1)

  },[serviceFilter,searchTerm,startDate,endDate])


  const handleClear = () => {
    setServiceFilter("")
    setSearchTerm(undefined)
    setStartDate("")
    setEndDate("")
    setFilteredRequirements(requirements)
    setCurrentPage(1)
  }

  // Pagination Logic
  const totalPages = Math.ceil(
    filteredRequirements.length / ITEMS_PER_PAGE
  )

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredRequirements.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    )
  }, [filteredRequirements, currentPage])

  const formatDate = (date: string) => {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  }

  const formatBudget = (min: number, max: number) =>
    `$${min.toLocaleString()} - $${max.toLocaleString()}`

  return (
    <div className="min-h-screen">

      {/* FILTER BAR */}
<div className="max-w-[95vw] overflow-x-auto mb-3">
   <MobileFilterBar className="max-w-[95vw] overflow-x-auto"
  searchSlot={
    <div className="w-full">
      <Input
      type="number"
      value={searchTerm}
      min={1}
      placeholder="Minimum Budget"
      onChange={(e) => setSearchTerm(parseInt(e.target.value))}
      className="w-full h-[35px] placeholder:text-gray-500 placeholder:text-sm border border-[#D0D5DD] rounded-full px-4 text-sm focus:outline-none"
    />
    </div>
  }
  activeFilterCount={
    (searchTerm ? 1 : 0) +
    (serviceFilter ? 1 : 0) +
    (startDate ? 1 : 0) +
    (endDate ? 1 : 0)
  }
  sheetTitle="Filter projects"
>
  {/* Service */}
  <div className="min-w-[180px] w-full mb-1">
    <ServiceDropdown
      value={serviceFilter}
      onChange={(value) => setServiceFilter(value)}
      triggerClassName="border border-[#D0D5DD] rounded-full w-full h-[35px]"
      triggerSpanClassName="text-[#98A0B4] text-sm"
    />
  </div>

  {/* Start Date */}
  <div className="min-w-[150px] w-full">
    <Input
      type={startDate ? "date" : "text"}
      placeholder="Filter by Start Date"
      value={startDate}
      onFocus={(e) => (e.target.type = "date")}
      onBlur={(e) => {
        if (!startDate) e.target.type = "text";
      }}
      onChange={(e) => setStartDate(e.target.value)}
      className="w-full h-[35px] border border-[#D0D5DD] rounded-full px-3 text-sm placeholder:text-gray-500 focus:outline-none"
    />
  </div>

  {/* End Date */}
  <div className="min-w-[150px] w-full">
    <Input
      type={endDate ? "date" : "text"}
      placeholder="Filter by End Date"
      value={endDate}
      onFocus={(e) => (e.target.type = "date")}
      onBlur={(e) => {
        if (!endDate) e.target.type = "text";
      }}
      onChange={(e) => setEndDate(e.target.value)}
      className="w-full h-[35px] border border-[#D0D5DD] rounded-full px-3 text-sm placeholder:text-gray-500 focus:outline-none"
    />
  </div>

  {/* Clear */}
  <Button
    className="btn-blackButton h-[33px] w-full md:w-auto md:min-w-[80px]"
    onClick={handleClear}
  >
    Clear
  </Button>
</MobileFilterBar>
</div>
      {/* TABLE VIEW */}
      <div className="border rounded-xl w-full max-w-[95vw] overflow-x-auto bg-white mx-auto px-px sm:px-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Posted Date</th>
              <th className="p-4">Title</th>
              <th className="p-4">Budget Range</th>
              <th className="p-4">Timeline</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((req) => (
              <tr
                key={req._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4">
                  {formatDate(req.createdAt)}
                </td>

                <td 
                onClick= {() => router.push(`/agency/dashboard/project-inquiries/${req._id}`)}
                className="p-4 font-medium cursor-pointer hover:text-blue-500">
                  {req.title}
                </td>

                <td className="p-4">
                  {formatBudget(
                    req.budgetMin,
                    req.budgetMax
                  )}
                </td>

                <td className="p-4">
                  {req.timeline}
                </td>

                <td className="p-4">
                  <Button
                    size="sm"
                    className=" primary-button"
                    onClick={() =>
                      router.push(
                        `/agency/dashboard/project-inquiries/${req._id}`
                      )
                    }
                  >
                    Submit Proposal
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedData.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No requirements found.
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            size="sm"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
          >
            Prev
          </Button>

          {Array.from({ length: totalPages }).map(
            (_, index) => (
              <Button
                key={index}
                size="sm"
                variant={
                  currentPage === index + 1
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setCurrentPage(index + 1)
                }
              >
                {index + 1}
              </Button>
            )
          )}

          <Button
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}