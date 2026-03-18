export default function PortfolioHeader() {
  return (
    <div className="space-y-1 h-15">
      {/* Title */}
      <h1 className="text-xl h-6 font-bold text-orangeButton"
      >
        Company Profile
      </h1>

      {/* Subtitle */}
      <p className="text-md text-gray-500">
        Showcase your work and achievements
      </p>

      {/* Divider */}
      <div className="pt-1">
        <div className="h-px w-full bg-gray-200" />
      </div>
    </div>
  )
}
