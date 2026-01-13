export default function FocusAreasCard() {
  return (
    <div className="space-y-6">

      {/* Focus Areas */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-2">
        <h3 className="text-[13px] font-semibold text-orange-500">
          Focus Areas
        </h3>

        <p className="text-[13px] leading-[1.6] text-gray-600">
          We primarily work with DTC ecommerce brands and high-growth SaaS
          looking for performance-driven creative and full-funnel acquisition.
        </p>
      </div>

      {/* Industries */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-2">
        <h3 className="text-[13px] font-semibold text-orange-500">
          Industries
        </h3>

        <p className="text-[13px] leading-[1.6] text-gray-600">
          E-commerce, Consumer Goods, SaaS, Fintech
        </p>
      </div>

      {/* Clients */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-2">
        <h3 className="text-[13px] font-semibold text-orange-500">
          Clients
        </h3>

        <p className="text-[13px] leading-[1.6] text-gray-600">
          Cherubini, PEZ, Alexander, Scarce, Liquid Rubber
        </p>
      </div>

    </div>
  )
}
