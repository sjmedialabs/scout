import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Users, Clock } from "lucide-react"
import Link from "next/link"

export default function ITServicesPage() {
  const providers = [
    {
      id: 1,
      name: "CloudTech Solutions",
      rating: 4.9,
      reviews: 156,
      location: "Seattle, WA",
      teamSize: "100-499",
      hourlyRate: "$80-160",
      specialties: ["Cloud Migration", "DevOps", "Cybersecurity"],
      description: "Enterprise IT solutions provider specializing in cloud infrastructure and security.",
    },
    {
      id: 2,
      name: "DataFlow Systems",
      rating: 4.7,
      reviews: 92,
      location: "Chicago, IL",
      teamSize: "25-99",
      hourlyRate: "$60-120",
      specialties: ["Data Analytics", "System Integration", "IT Consulting"],
      description: "IT consulting firm focused on data management and system optimization.",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">IT Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Find expert IT service providers for cloud solutions, cybersecurity, system integration, and technical
          consulting to transform your business infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">1,800+</div>
            <div className="text-gray-600">IT Experts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">950+</div>
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
            <div className="text-3xl font-bold text-orange-600">24h</div>
            <div className="text-gray-600">Avg Response Time</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top IT Service Providers</h2>
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
              <CardTitle>Need IT Services?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Connect with certified IT professionals for your technology needs.</p>
              <Button className="w-full" asChild>
                <Link href="/register">Post a Project</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular IT Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="#" className="block text-blue-600 hover:underline">
                  Cloud Migration
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Cybersecurity
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  System Integration
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  IT Consulting
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Network Setup
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Data Recovery
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
