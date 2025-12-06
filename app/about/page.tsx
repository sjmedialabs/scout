import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, Award, Globe } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const stats = [
    { label: "Active Users", value: "50,000+", icon: Users },
    { label: "Projects Completed", value: "25,000+", icon: Target },
    { label: "Success Rate", value: "98%", icon: Award },
    { label: "Countries", value: "120+", icon: Globe },
  ]

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      bio: "Former VP of Engineering at TechCorp with 15 years of experience building scalable platforms.",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO",
      bio: "Full-stack architect passionate about connecting businesses with the right talent.",
    },
    {
      name: "Emily Watson",
      role: "Head of Operations",
      bio: "Operations expert focused on creating seamless experiences for all platform users.",
    },
  ]

  return (
    <div className="bg-background">
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">About Spark</h1>
            <p className="text-xl text-muted-foreground text-balance">
              We're building the future of B2B service connections, making it easier for businesses to find and work
              with qualified agencies.
            </p>
          </div>

          {/* Mission */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Spark, we believe that every business deserves access to high-quality services that help them grow
                and succeed. Our platform connects clients with verified agencies, creating a transparent marketplace
                where quality work meets fair pricing.
              </p>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <div className="text-2xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Story */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Spark was founded in 2023 when our team experienced firsthand the challenges of finding reliable
                agencies for business needs. Traditional methods were time-consuming, lacked transparency, and often
                resulted in mismatched expectations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We set out to create a platform that would solve these problems by providing detailed requirements
                posting, transparent proposal processes, and comprehensive review systems. Today, Spark serves thousands
                of businesses worldwide.
              </p>
            </CardContent>
          </Card>

          {/* Team */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Meet Our Team</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {team.map((member) => (
                <Card key={member.name}>
                  <CardHeader>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Values */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Transparency</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear pricing, detailed proposals, and honest reviews create trust between all parties.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Quality</h3>
                  <p className="text-sm text-muted-foreground">
                    We verify agencies and maintain high standards to ensure excellent service delivery.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Innovation</h3>
                  <p className="text-sm text-muted-foreground">
                    Continuously improving our platform with new features and better user experiences.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Building a supportive ecosystem where businesses and agencies can thrive together.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Join Spark?</h2>
            <p className="text-muted-foreground mb-6">
              Whether you're looking for services or offering them, we'd love to have you in our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">Get Started Today</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
