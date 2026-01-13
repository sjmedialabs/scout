import { Star } from "lucide-react"

export default function Testimonials() {
  const reviews = [
    {
      name: "Alex Morgan",
      company: "DTC Brand",
      rating: 5,
      review:
        "The team consistently delivered high-quality creative and performance improvements. Our ROAS improved significantly within the first 60 days.",
    },
    {
      name: "Sarah Lee",
      company: "SaaS Startup",
      rating: 4,
      review:
        "Great communication and strong execution. Their strategic approach helped us scale lead generation efficiently.",
    },
    {
      name: "James Carter",
      company: "E-commerce Company",
      rating: 5,
      review:
        "Professional, data-driven, and reliable. They became a true extension of our internal growth team.",
    },
  ]

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
      <h3 className="text-[14px] font-semibold text-orange-500">
        What Clients Are Saying
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3"
          >
            {/* Stars */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating
                      ? "fill-orange-400 text-orange-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Review text */}
            <p className="text-[13px] leading-[1.6] text-gray-600">
              {review.review}
            </p>

            {/* Author */}
            <div className="pt-1">
              <p className="text-[13px] font-medium text-gray-800">
                {review.name}
              </p>
              <p className="text-[12px] text-gray-500">
                {review.company}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
