type PricingSnapshotProps = {
  provider: {
    minAmount?: number
    hourlyRate?: string
    costRating?: number
  }
}

export default function PricingSnapshot(
  { provider, variant = "default" }: PricingSnapshotProps & { variant?: "default" | "compact" |"large" }
) {

const isCompact = variant === "compact";
const isLarge = variant === "large";
  
  return (
    <div
      className="shadow-md border-orange-100 bg-white overflow-hidden rounded-2xl border p-6 space-y-4 px-6 py-5"
    >
      {/* Title */}
      <h3 className={`${isCompact ? "text-[14px]" : "text-[16px]"} font-semibold text-orangeButton`}>
        Pricing Snapshot
      </h3>

      {/* Content */}
      <div className="flex flex-wrap flex-row justify-between gap-6">
        {/* Min project size */}
          <div className="flex flex-row sm:flex-col gap-1">
            <span className={`${isCompact ? "text-[9px]" : "text-[10px]"} font-semibold`}>
              Min. project size
            </span>

            <span className="text-xs sm:hidden">:</span>

            <span className={`${isCompact ? "text-[10px]" : "text-[16px]"} text-gray-600 text-center font-bold sm:text-black`}>
              ${provider.minAmount ?? 0}+
            </span>
          </div>

          {/* Avg hourly rate */}
          <div className="flex flex-row sm:flex-col gap-1">
            <span className={`${isCompact ? "text-[9px]" : "text-[10px]"} font-semibold`}>
              Avg. hourly rate
            </span>

            <span className="text-xs sm:hidden">:</span>

            <span className={`${isCompact ? "text-[10px]" : "text-[16px]"} text-gray-600 text-center font-bold sm:text-black`}>
              {provider.hourlyRate ?? "—"} / hr
            </span>
          </div>

          {/* Rating for cost */}
          <div className="flex flex-row sm:flex-col gap-1">
            <span className={`${isCompact ? "text-[9px]" : "text-[10px]"} font-semibold`}>
              Rating for cost
            </span>

            <span className="text-xs sm:hidden">:</span>

            <span className={`${isCompact ? "text-[10px]" : "text-[16px]"} text-gray-600 text-center font-bold sm:text-black`}>
              {provider.costRating ?? 0} / 5
            </span>
          </div>
      </div>
    </div>
  )
}
