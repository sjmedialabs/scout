import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, MapPin, Briefcase } from "lucide-react"
import Link from "next/link"

export default function ProvidersPage() {
  const providers = [
    {
      id: "1",
      name: "TechCraft Solutions",
      tagline: "Full-stack development experts",
      services: ["Web Development", "Mobile Apps", "API Development"],
      rating: 4.9,
      reviews: 127,
      location: "San Francisco, CA",
      verified: true,
      featured: true,
      completedProjects: 89,
      responseTime: "2 hours",
      startingPrice: "$75/hour",
    },
    {
      id: "2",
      name: "Creative Design Studio",
      tagline: "Bringing your vision to life",
      services: ["UI/UX Design", "Branding", "Graphic Design"],
      rating: 4.8,
      reviews: 89,
      location: "New York, NY",
      verified: true,
      featured: false,
      completedProjects: 156,
      responseTime: "4 hours",
      startingPrice: "$60/hour",
    },
    {
      id: "3",
      name: "Growth Marketing Pro",
      tagline: "Data-driven marketing solutions",
      services: ["Digital Marketing", "SEO", "Content Strategy"],
      rating: 4.7,
      reviews: 156,
      location: "Austin, TX",
      verified: true,
      featured: true,
      completedProjects: 203,
      responseTime: "1 hour",
      startingPrice: "$85/hour",
    },
    {
      id: "4",
      name: "DataViz Analytics",
      tagline: "Transform data into insights",
      services: ["Data Analytics", "Business Intelligence", "Reporting"],
      rating: 4.9,
      reviews: 74,
      location: "Seattle, WA",
      verified: true,
      featured: false,
      completedProjects: 67,
      responseTime: "3 hours",
      startingPrice: "$90/hour",
    },
    {
      id: "5",
      name: "CloudOps Specialists",
      tagline: "Scalable cloud infrastructure",
      services: ["DevOps", "Cloud Migration", "System Architecture"],
      rating: 4.8,
      reviews: 92,
      location: "Denver, CO",
      verified: true,
      featured: false,
      completedProjects: 134,
      responseTime: "2 hours",
      startingPrice: "$95/hour",
    },
    {
      id: "6",
      name: "Mobile First Design",
      tagline: "Mobile-first approach to everything",
      services: ["Mobile App Design", "Responsive Design", "User Research"],
      rating: 4.6,
      reviews: 108,
      location: "Los Angeles, CA",
      verified: false,
      featured: false,
      completedProjects: 78,
      responseTime: "6 hours",
      startingPrice: "$55/hour",
    },
  ]

  return (
    <div className="bg-background">
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Service Providers</h1>
            <p className="text-muted-foreground">Find verified professionals for your next project</p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search providers..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Service Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="remote">Remote Only</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Providers Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {providers.map((provider) => (
              <Card key={provider.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      {provider.verified && <Badge variant="secondary">Verified</Badge>}
                      {provider.featured && <Badge>Featured</Badge>}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{provider.rating}</span>
                      <span className="text-sm text-muted-foreground">({provider.reviews})</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{provider.name}</CardTitle>
                  <CardDescription>{provider.tagline}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {provider.services.map((service) => (
                      <Badge key={service} variant="outline">
                        {service}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{provider.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-3 w-3 text-muted-foreground" />
                      <span>{provider.completedProjects} projects</span>
                    </div>
                    <div className="text-muted-foreground">Response: {provider.responseTime}</div>
                    <div className="font-semibold text-primary">From {provider.startingPrice}</div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/provider/${provider.id}`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        View Profile
                      </Button>
                    </Link>
                    <Button className="flex-1">Contact Provider</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Providers
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
