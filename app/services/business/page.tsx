import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Users, Clock } from "lucide-react"
import Link from "next/link"

export default function BusinessServicesPage() {
  const providers = [
    {
      id: 1,
      name: "Strategic Business Solutions",
      rating: 4.8,
      reviews: 167,
      location: "Boston, MA",
      teamSize: "100-499",
      hourlyRate: "$150-300",
      specialties: ["Business Strategy", "Operations", "Financial Planning"],
      description: "Management consulting firm helping businesses optimize operations and drive growth.",
    },
    {
      id: 2,
      name: "Growth Partners LLC",
      rating: 4.7,
      reviews: 98,
      location: "Denver, CO",
      teamSize: "25-99",
      hourlyRate: "$100-200",
      specialties: ["Market Research", "Business Development", "Process Improvement"],
      description: "Business consulting specialists focused on market expansion and operational efficiency.",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Business Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Find expert business consultants and service providers for strategy, operations, financial planning, market
          research, and business development solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">1,500+</div>
            <div className="text-gray-600">Business Experts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">800+</div>
            <div className="text-gray-600">Projects Delivered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">4.7</div>
            <div className="text-gray-600">Average Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">12h</div>
            <div className="text-gray-600">Avg Response Time</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Business Consultants</h2>
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
              <CardTitle>Need Business Consulting?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Connect with experienced business consultants to grow your company.</p>
              <Button className="w-full" asChild>
                <Link href="/register">Post a Project</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Business Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="#" className="block text-blue-600 hover:underline">
                  Business Strategy
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Market Research
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Financial Planning
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Operations Consulting
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Business Development
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Process Improvement
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
