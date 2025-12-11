"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// import { Edit } from "lucide-react"
import {
  Building2,
  FileText,
  Star,
  TrendingUp,
  DollarSign,
  Calendar,
  MessageSquare,
  Award,
  Edit,
  Settings,
  BarChart3,
  Users,
  Megaphone,
  CreditCard,
  Bell,
  UserPlus,
  ChevronDown,
  ChevronRight,
  Home,
  User,
  Briefcase,
  MessageCircle,
  FileSearch,
  Eye,
  GitCompare,
  Download,
  Phone,
  Video,
  Paperclip,
  Send,
  Mail,
  Clock,
  CheckCircle,
  X,
  Target,
  Handshake,
} from "lucide-react"

const AgencyPortfolio=()=>{
    return(
         <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
                  <p className="text-muted-foreground">Showcase your work and achievements</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Overview & Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Overview Section */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Company Overview</h3>
                          <Button variant="outline" size="sm" onClick={() => setShowEditProfile(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        </div>
                        <p className="text-sm leading-relaxed">
                          We design and run high-performing paid social and search campaigns, create thumb-stopping
                          creative, and optimize landing experiences to scale predictable revenue for DTC and SaaS
                          brands.
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                          <div>
                            <span className="font-medium">Employees:</span> 10–49
                          </div>
                          <div>
                            <span className="font-medium">Founded:</span> 2016
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Service Lines */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Service Lines</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Social Media Marketing</span>
                                <span className="text-sm text-muted-foreground">45%</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Email Marketing</span>
                                <span className="text-sm text-muted-foreground">15%</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Advertising</span>
                                <span className="text-sm text-muted-foreground">10%</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Digital Strategy</span>
                                <span className="text-sm text-muted-foreground">10%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pricing Snapshot */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Pricing Snapshot</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-6 text-center">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Min. project size</div>
                            <div className="text-xl font-bold">0+</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Avg. hourly rate</div>
                            <div className="text-xl font-bold">
                            0 / hr
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Rating for cost</div>
                            <div className="text-xl font-bold">4.8 / 5</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Focus Areas & Details */}
                  <div className="space-y-6">
                    {/* Focus Areas */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Focus Areas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm leading-relaxed">
                          We primarily work with DTC ecommerce brands and high-growth SaaS looking for
                          performance-driven creative and full-funnel acquisition.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Industries */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Industries</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">E-commerce, Consumer Goods, SaaS, Fintech</div>
                      </CardContent>
                    </Card>

                    {/* Clients */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Clients</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">Cheribundi, PEZ, Alexander, Scarce, Liquid Rubber</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="w-full">
                  <Card>
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        {/* Portfolio & Awards Header */}
                        <div className="flex justify-between items-center">
                          <div>
                            <h2 className="text-2xl font-bold">Portfolio & Awards</h2>
                            <p className="text-muted-foreground">
                              Selected case studies with visuals and measurable outcomes.
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Show:</span>
                            <select className="border border-border rounded-md px-3 py-1 text-sm bg-background">
                              <option>All</option>
                              <option>Social Media</option>
                              <option>Creative</option>
                              <option>User Acquisition</option>
                              <option>Ecommerce</option>
                              <option>Paid Ads</option>
                            </select>
                          </div>
                        </div>

                        {/* Case Studies Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Cheribundi Case Study */}
                          <Card className="overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold text-red-700">Cheribundi • Visual Collage</div>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-2">Driving top line revenue for Cheribundi</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                Paid social creative + funnel testing that delivered a significant revenue lift during
                                campaign windows.
                              </p>
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                  Social Media
                                </Badge>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-600">+30% Revenue</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* PEZ Case Study */}
                          <Card className="overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold text-orange-700">PEZ • Brand Content</div>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-2">Content Creation for PEZ</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                Playful, platform-native content designed for reach and shareability.
                              </p>
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                                  Creative
                                </Badge>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-600">High Reach</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Alexander Case Study */}
                          <Card className="overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold text-purple-700">Alexander • UA Creative</div>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-2">App install growth for Alexander</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                Creative-led user acquisition with CPI reductions and scalable channels.
                              </p>
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                  User Acquisition
                                </Badge>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-600">3x lower CPI</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Kjaer Weis Case Study */}
                          <Card className="overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-700">Kjaer Weis • DTC</div>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-2">Growing e-commerce for Kjaer Weis</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                Conversion optimisation, landing pages & creative to support premium DTC growth.
                              </p>
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  Ecommerce
                                </Badge>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-600">+12% Conv.</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Scarce Case Study */}
                          <Card className="overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold text-indigo-700">Scarce • Product Launch</div>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-2">Ecommerce campaigns for Scarce</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                End-to-end acquisition + creative testing to identify scaleable audiences.
                              </p>
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                  Paid Ads
                                </Badge>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-600">Strong ROAS</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Liquid Rubber Case Study */}
                          <Card className="overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-gray-100 to-slate-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-700">Liquid Rubber • US Growth</div>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-2">Ecommerce Growth for Liquid Rubber (US)</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                Landing pages, paid channels, and lifecycle to scale US revenue.
                              </p>
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  Ecommerce
                                </Badge>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-600">+22% Repeat</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full">
                  <Card>
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold mb-6 text-center">What Clients Are Saying</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                          {
                            name: "Sarah Johnson",
                            company: "TechStart Inc.",
                            rating: 5,
                            comment:
                              "Exceptional work on our e-commerce platform. The team delivered beyond our expectations with great attention to detail and timely communication.",
                          },
                          {
                            name: "Michael Chen",
                            company: "Digital Solutions",
                            rating: 5,
                            comment:
                              "Professional, reliable, and innovative. They transformed our outdated website into a modern, user-friendly platform that increased our conversions by 40%.",
                          },
                          {
                            name: "Emily Rodriguez",
                            company: "Creative Agency",
                            rating: 5,
                            comment:
                              "Outstanding design and development skills. The project was completed on time and within budget. Highly recommend for any web development needs.",
                          },
                        ].map((testimonial, index) => (
                          <div key={index} className="bg-muted/50 p-6 rounded-lg">
                            <div className="flex items-center gap-1 mb-3">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <p className="text-sm mb-4 italic">"{testimonial.comment}"</p>
                            <div>
                              <p className="font-medium text-sm">{testimonial.name}</p>
                              <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
    )
}
export default AgencyPortfolio