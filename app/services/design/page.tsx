import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Users, Clock } from "lucide-react"
import Link from "next/link"

export default function DesignServicesPage() {
  const providers = [
    {
      id: 1,
      name: "Creative Studio Pro",
      rating: 4.9,
      reviews: 178,
      location: "San Francisco, CA",
      teamSize: "25-99",
      hourlyRate: "$80-160",
      specialties: ["UI/UX Design", "Branding", "Web Design"],
      description: "Award-winning design studio creating exceptional user experiences and brand identities.",
    },
    {
      id: 2,
      name: "Pixel Perfect Design",
      rating: 4.8,
      reviews: 134,
      location: "Portland, OR",
      teamSize: "10-49",
      hourlyRate: "$60-120",
      specialties: ["Graphic Design", "Print Design", "Logo Design"],
      description: "Creative design agency specializing in visual identity and print design solutions.",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Design Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Connect with talented designers and creative agencies for UI/UX design, branding, graphic design, and visual
          solutions that make your business stand out.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">2,800+</div>
            <div className="text-gray-600">Designers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">1,500+</div>
            <div className="text-gray-600">Projects Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">4.9</div>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Design Agencies</h2>
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
              <CardTitle>Need Design Work?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Find creative professionals to bring your vision to life.</p>
              <Button className="w-full" asChild>
                <Link href="/register">Post a Project</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Design Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="#" className="block text-blue-600 hover:underline">
                  UI/UX Design
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Logo Design
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Web Design
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Branding
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Graphic Design
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Print Design
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
