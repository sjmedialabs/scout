import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Users, Clock } from "lucide-react"
import Link from "next/link"

export default function DevelopmentServicesPage() {
  const providers = [
    {
      id: 1,
      name: "TechCorp Solutions",
      rating: 4.9,
      reviews: 127,
      location: "San Francisco, CA",
      teamSize: "50-249",
      hourlyRate: "$75-150",
      specialties: ["Web Development", "Mobile Apps", "E-commerce"],
      description: "Full-stack development company specializing in modern web and mobile applications.",
    },
    {
      id: 2,
      name: "CodeCraft Studio",
      rating: 4.8,
      reviews: 89,
      location: "Austin, TX",
      teamSize: "10-49",
      hourlyRate: "$50-100",
      specialties: ["React", "Node.js", "Cloud Solutions"],
      description: "Agile development team focused on scalable web applications and cloud infrastructure.",
    },
  ]

  const requirements = [
    {
      id: 1,
      title: "E-commerce Platform Development",
      budget: "$25,000 - $50,000",
      timeline: "3-4 months",
      proposals: 12,
      category: "Web Development",
    },
    {
      id: 2,
      title: "Mobile App for Food Delivery",
      budget: "$15,000 - $30,000",
      timeline: "2-3 months",
      proposals: 8,
      category: "Mobile Development",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Development Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Connect with top development companies and freelancers for web development, mobile apps, software engineering,
          and custom solutions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">2,500+</div>
            <div className="text-gray-600">Developers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">1,200+</div>
            <div className="text-gray-600">Projects Completed</div>
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
            <div className="text-3xl font-bold text-orange-600">48h</div>
            <div className="text-gray-600">Avg Response Time</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Top Providers */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Development Providers</h2>
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

          {/* Recent Requirements */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Development Requirements</h2>
            <div className="space-y-4">
              {requirements.map((req) => (
                <Card key={req.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{req.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <Badge variant="outline">{req.category}</Badge>
                          <span>Budget: {req.budget}</span>
                          <span>Timeline: {req.timeline}</span>
                          <span>{req.proposals} proposals</span>
                        </div>
                      </div>
                      <Button variant="outline" asChild>
                        <Link href="/register">Submit Proposal</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Post Your Development Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Get matched with qualified development teams in 48 hours.</p>
              <Button className="w-full" asChild>
                <Link href="/register">Post a Project</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Development Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="#" className="block text-blue-600 hover:underline">
                  Web Development
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Mobile App Development
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  E-commerce Development
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Custom Software
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  API Development
                </Link>
                <Link href="#" className="block text-blue-600 hover:underline">
                  Database Design
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
