import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Clock, DollarSign } from "lucide-react"

export default function BrowsePage() {
  const requirements = [
    {
      id: "1",
      title: "E-commerce Website Development",
      category: "Web Development",
      budget: "$5,000 - $10,000",
      timeline: "3 months",
      description:
        "Looking for a modern e-commerce platform with payment integration, inventory management, and responsive design. Must support multiple payment gateways and have admin dashboard.",
      postedDate: "2 days ago",
      proposals: 12,
      status: "Open",
    },
    {
      id: "2",
      title: "Mobile App UI/UX Design",
      category: "Design",
      budget: "$2,000 - $5,000",
      timeline: "6 weeks",
      description:
        "Need a complete UI/UX design for a fitness tracking mobile app. Should include wireframes, prototypes, and final designs for both iOS and Android platforms.",
      postedDate: "1 week ago",
      proposals: 8,
      status: "Open",
    },
    {
      id: "3",
      title: "Digital Marketing Campaign",
      category: "Marketing",
      budget: "$1,000 - $3,000",
      timeline: "2 months",
      description:
        "Comprehensive digital marketing strategy for B2B SaaS product launch. Includes social media, content marketing, and paid advertising campaigns.",
      postedDate: "3 days ago",
      proposals: 15,
      status: "Open",
    },
    {
      id: "4",
      title: "Data Analytics Dashboard",
      category: "Development",
      budget: "$8,000 - $15,000",
      timeline: "4 months",
      description:
        "Build a comprehensive analytics dashboard with real-time data visualization, custom reports, and integration with multiple data sources.",
      postedDate: "5 days ago",
      proposals: 6,
      status: "Open",
    },
    {
      id: "5",
      title: "Brand Identity Design",
      category: "Design",
      budget: "$3,000 - $7,000",
      timeline: "8 weeks",
      description:
        "Complete brand identity package including logo design, color palette, typography, and brand guidelines for a tech startup.",
      postedDate: "1 day ago",
      proposals: 4,
      status: "Open",
    },
    {
      id: "6",
      title: "SEO Optimization Service",
      category: "Marketing",
      budget: "$2,500 - $5,000",
      timeline: "3 months",
      description:
        "Comprehensive SEO audit and optimization for an existing website. Includes technical SEO, content optimization, and link building strategy.",
      postedDate: "4 days ago",
      proposals: 11,
      status: "Open",
    },
  ]

  const categories = ["All Categories", "Web Development", "Design", "Marketing", "Development", "Consulting"]

  return (
    <div className="bg-background">
      {/* Navigation component rendering removed */}

      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Browse Requirements</h1>
            <p className="text-muted-foreground">Discover opportunities from businesses looking for your services</p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search requirements..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Budget Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-1k">Under $1,000</SelectItem>
                    <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                    <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10k-plus">$10,000+</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Requirements Grid */}
          <div className="grid gap-6">
            {requirements.map((req) => (
              <Card key={req.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <Badge variant="secondary">{req.category}</Badge>
                      <Badge variant="outline">{req.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {req.postedDate}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{req.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-base">{req.description}</CardDescription>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{req.budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{req.timeline}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{req.proposals} proposals received</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button variant="outline">View Details</Button>
                    <Button>Submit Proposal</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Requirements
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
