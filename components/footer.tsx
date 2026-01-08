import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-primary-500" />
              <h3 className="font-bold text-xl text-white">WanderHub</h3>
            </div>
            <p className="text-sm text-gray-400">
              Discover amazing destinations and create unforgettable memories with AI-powered travel recommendations.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Explore</h4>
            <div className="flex flex-col gap-2">
              <Link href="/search" className="text-sm hover:text-primary-400 transition">
                Search Destinations
              </Link>
              <Link href="/dashboard" className="text-sm hover:text-primary-400 transition">
                My Dashboard
              </Link>
              <Link href="/dashboard/nearby" className="text-sm hover:text-primary-400 transition">
                Nearby Places
              </Link>
              <Link href="/dashboard/favorites" className="text-sm hover:text-primary-400 transition">
                My Favorites
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Resources</h4>
            <div className="flex flex-col gap-2">
              <Link href="/dashboard/survey" className="text-sm hover:text-primary-400 transition">
                Travel Preferences
              </Link>
              <Link href="/dashboard/settings" className="text-sm hover:text-primary-400 transition">
                Settings
              </Link>
              <Link href="/" className="text-sm hover:text-primary-400 transition">
                How It Works
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Connect</h4>
            <div className="flex gap-4 mb-4">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-primary-400 transition" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-primary-400 transition" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-primary-400 transition" />
              <Mail className="w-5 h-5 cursor-pointer hover:text-primary-400 transition" />
            </div>
            <p className="text-sm text-gray-400">
              Get personalized travel recommendations delivered to your inbox.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2024 WanderHub. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/" className="text-sm hover:text-primary-400 transition">
              Privacy Policy
            </Link>
            <Link href="/" className="text-sm hover:text-primary-400 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}


