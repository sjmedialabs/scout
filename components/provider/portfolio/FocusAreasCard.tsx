export default function FocusAreasCard() {
  return (
    <div className="space-y-6">

      {/* Focus Areas */}
      <div className="shadow-md rounded-2xl border border-orange-100 bg-white p-5 space-y-1">
        <h3 className="text-[16px] font-semibold text-orangeButton h-5 my-custom-class">
          Focus Areas
        </h3>

        <p className="text-[12px] leading-[1.6] text-gray-600">
          We primarily work with DTC ecommerce brands and high-growth SaaS
          looking for performance-driven creative and full-funnel acquisition.
        </p>
      </div>

      {/* Industries */}
      <div className="shadow-md rounded-2xl border border-orange-100 bg-white p-5 space-y-1">
        <h3 className="text-[16px] font-semibold text-orangeButton h-5 my-custom-class">
          Industries
        </h3>

        <p className="text-[12px] leading-[1.6] text-gray-600">
          E-commerce, Consumer Goods, SaaS, Fintech
        </p>
      </div>

      {/* Clients */}
      <div className="shadow-md rounded-2xl border border-orange-100 bg-white p-5 space-y-1">
        <h3 className="text-[16px] font-semibold text-orangeButton h-5 my-custom-class">
          Clients
        </h3>

        <p className="text-[12px] leading-[1.6] text-gray-600">
          Cherubini, PEZ, Alexander, Scarce, Liquid Rubber
        </p>
      </div>

    </div>
  )
}
