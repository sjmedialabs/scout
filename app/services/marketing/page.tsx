import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Users, Clock } from "lucide-react"
import Link from "next/link"

export default function MarketingServicesPage() {
  const providers = [
    {
      id: 1,
      name: "Digital Growth Agency",
      rating: 4.8,
      reviews: 203,
      location: "New York, NY",
      teamSize: "50-249",
      hourlyRate: "$100-200",
      specialties: ["SEO", "PPC", "Content Marketing"],
      description: "Full-service digital marketing agency driving growth through data-driven strategies.",
    },
    {
      id: 2,
      name: "Brand Boost Marketing",
      rating: 4.9,
      reviews: 145,
      location: "Los Angeles, CA",
      teamSize: "10-49",
      hourlyRate: "$75-150",
      specialties: ["Social Media", "Brand Strategy", "Influencer Marketing"],
      description: "Creative marketing team specializing in brand development and social media growth.",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Marketing Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Partner with top marketing agencies and specialists for digital marketing, brand development, SEO, social
          media, and growth strategies that drive results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">3,200+</div>
            <div className="text-gray-600">Marketing Experts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">1,800+</div>
            <div className="text-gray-600">Campaigns Launched</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">4.8</div>
            <div className="text-gray-600">Average Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">36h</div>
            <div className="text-gray-600">Avg Response Time</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Marketing Agencies</h2>
          <div className="space-y-6">
            {providers.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{provider.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>{provider.rating}</span>
                          <span className="ml-1">({provider.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{provider.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{provider.teamSize}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{provider.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {provider.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {provider.hourlyRate}/hour
                      </div>
                    </div>
                    <Button asChild>
                      <Link href="/contact">View Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Grow Your Business</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Find marketing experts to boost your brand and drive growth.</p>
              <Button className="w-full" asChild>
                <Link href="/register">Post a Project</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Marketing Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="#" className="block text-blue-600 hover:underline">
                  SEO Optimization
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  PPC Advertising
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Social Media Marketing
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Content Marketing
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Email Marketing
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Brand Strategy
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
