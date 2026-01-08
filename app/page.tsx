"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  MessageSquare,
  Bell,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [budget, setBudget] = useState("")
  const [interests, setInterests] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.append("q", location)
    if (interests) params.append("interests", interests)
    router.push(`/search/results?${params.toString()}`)
  }

  const interestCategories = [
    { name: "Beaches", icon: "🏖️", color: "from-blue-400 to-cyan-500" },
    { name: "Mountains", icon: "⛰️", color: "from-green-400 to-emerald-500" },
    { name: "Waterfalls", icon: "🌊", color: "from-cyan-400 to-blue-500" },
    { name: "Temples", icon: "🕉️", color: "from-orange-400 to-amber-500" },
    { name: "Historical", icon: "🏛️", color: "from-purple-400 to-pink-500" },
    { name: "Adventure", icon: "🧗", color: "from-red-400 to-orange-500" },
  ]

  const howItWorks = [
    {
      step: "1",
      title: "Tell Us Your Interests",
      description: "Share what you love - beaches, mountains, culture, or adventure. Our AI understands your preferences.",
      icon: Sparkles,
    },
    {
      step: "2",
      title: "Discover Hidden Gems",
      description: "Get personalized recommendations based on your location, budget, and interests. Find places you never knew existed.",
      icon: Search,
    },
    {
      step: "3",
      title: "Chat with AI Guide",
      description: "Ask our AI assistant anything about your destination. Get real-time tips, best times to visit, and local insights.",
      icon: MessageSquare,
    },
    {
      step: "4",
      title: "Get Notified",
      description: "Receive smart notifications about amazing places within 50km, perfectly matched to your preferences.",
      icon: Bell,
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "WanderHub helped me discover the most beautiful hidden waterfall just 30km from my home. The AI chatbot gave me perfect timing tips!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      text: "The personalized recommendations are spot-on. Found three amazing beaches I never knew existed, all within my budget range.",
      rating: 5,
    },
    {
      name: "Emma Davis",
      text: "Best travel app ever! The location-based notifications are genius. I get notified about perfect destinations based on my interests.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-blue-50 to-primary-100 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Your Perfect
            <span className="text-primary-600"> Adventure</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Find hidden gems, beaches, waterfalls, and more based on your interests. AI-powered travel
            recommendations tailored just for you.
          </p>
        </div>
      </section>

      {/* Search Form */}
      <section className="bg-white -mt-16 relative z-10 pb-12">
        <div className="container mx-auto px-4">
          <Card className="shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Plan Your Trip</CardTitle>
              <CardDescription className="text-center">
                Search by location, interests, or describe what you're looking for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-primary-600" />
                    <Input
                      type="text"
                      placeholder="Where to?"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-primary-600" />
                    <Input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-primary-600" />
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select budget</option>
                      <option value="low">Budget (&lt;$500)</option>
                      <option value="medium">Mid-range ($500-$1500)</option>
                      <option value="high">Luxury (&gt;$1500)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-3 h-5 w-5 text-primary-600" />
                    <select
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select interest</option>
                      <option value="beaches">Beaches</option>
                      <option value="hills">Mountains</option>
                      <option value="waterfalls">Waterfalls</option>
                      <option value="temples">Temples</option>
                      <option value="historical">Historical</option>
                      <option value="adventure">Adventure</option>
                    </select>
                  </div>
                </div>
              </form>

              <Button type="submit" onClick={handleSearch} size="lg" className="w-full">
                <Search className="mr-2 h-5 w-5" />
                Explore Destinations
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interest Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Explore by Interest</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Find destinations that match your passion
          </p>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {interestCategories.map((category) => (
              <Link key={category.name} href={`/search/results?q=${category.name.toLowerCase()}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}
                    >
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">How It Works</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Your journey to perfect destinations in four simple steps
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step) => {
              const Icon = step.icon
              return (
                <Card key={step.step} className="text-center">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <div className="w-8 h-8 mx-auto mb-4 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{step.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Why Choose WanderHub?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Sparkles className="h-10 w-10 text-primary-600 mb-4" />
                <CardTitle>Smart Discovery</CardTitle>
                <CardDescription>
                  Find destinations based on your interests, not just names. Tell us you want "quiet hills"
                  and we'll find the perfect spots.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-primary-600 mb-4" />
                <CardTitle>AI Travel Guide</CardTitle>
                <CardDescription>
                  Chat with our AI assistant that knows everything about your chosen destination. Get
                  real-time answers and travel tips.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-10 w-10 text-primary-600 mb-4" />
                <CardTitle>Location-Based</CardTitle>
                <CardDescription>
                  Discover places near you. Get notified about amazing destinations within 50km based on
                  your preferences.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">What Travelers Say</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">Verified Traveler</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of travelers discovering amazing places every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button size="lg" variant="secondary">
                Explore Destinations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
                Get Personalized Recommendations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
