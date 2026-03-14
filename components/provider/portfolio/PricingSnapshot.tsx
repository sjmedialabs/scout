type PricingSnapshotProps = {
  provider: {
    minAmount?: number
    hourlyRate?: string
    costRating?: number
  }
}

export default function PricingSnapshot({ provider }: PricingSnapshotProps) {
  return (
    <div
      className="shadow-md border-orange-100 bg-white overflow-hidden rounded-2xl border p-6 space-y-4 px-6 py-5"
    >
      {/* Title */}
      <h3 className="text-[16px] font-semibold text-orangeButton mb-4">
        Pricing Snapshot
      </h3>

      {/* Content */}
      <div className="flex flex-wrap flex-row justify-between gap-6">
        {/* Min project size */}
          <div className="flex flex-row sm:flex-col gap-1">
            <span className="text-[10px] font-semibold">
              Min. project size
            </span>

            <span className="text-xs sm:hidden">:</span>

            <span className="text-[10px] text-gray-600 sm:text-[16px] text-center font-bold sm:text-black">
              ${provider.minAmount ?? 0}+
            </span>
          </div>

          {/* Avg hourly rate */}
          <div className="flex flex-row sm:flex-col gap-1">
            <span className="text-[10px] font-semibold">
              Avg. hourly rate
            </span>

            <span className="text-xs sm:hidden">:</span>

            <span className="text-[10px] text-gray-600 sm:text-[16px] text-center font-bold sm:text-black">
              {provider.hourlyRate ?? "—"} / hr
            </span>
          </div>

          {/* Rating for cost */}
          <div className="flex flex-row sm:flex-col gap-1">
            <span className="text-[10px] font-semibold">
              Rating for cost
            </span>

            <span className="text-xs sm:hidden">:</span>

            <span className="text-[10px] text-gray-600 sm:text-[16px] text-center font-bold sm:text-black">
              {provider.costRating ?? 0} / 5
            </span>
          </div>
      </div>
    </div>
  )
}
