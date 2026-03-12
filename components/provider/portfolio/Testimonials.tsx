"use client"

type Testimonial = {
  _id: string
  rating: number
  content: string
  client: {
    name: string
    position: string
  }
}

export default function Testimonials({
  testimonials = [],
}: {
  testimonials?: Testimonial[]
}) {
  if (!testimonials.length) return null

  const topTestimonials = [...testimonials]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6)

  return (
    <div className="shadow-md rounded-2xl border border-orange-100 bg-white p-6 space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-[16px] font-semibold h-5 text-orangeButton">
          What Clients Are Saying
        </h3>
        <p className="text-[12px] text-gray-500">
          Trusted by leaders from various industries
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {topTestimonials.map((item, index) => (
          <div
            key={item._id || index}
            className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col"
          >

            {/* Rating */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-[14px] ${
                    i < item.rating ? "text-[#E0AA12]" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Review text */}
            <p className="text-[12px] leading-normal italic text-gray-500">

              “{item?.content}”
            </p>

         
            <div className="mt-auto pt-3">
              <p className="text-[12px] font-semibold text-gray-900">
                {item?.client?.name}
              </p>
              <p className="text-[11px] text-gray-500">
                {item?.client?.position}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
