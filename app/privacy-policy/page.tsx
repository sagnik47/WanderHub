import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-10 flex-1 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <div className="bg-white rounded-lg border p-6 space-y-5 text-gray-700 leading-7">
          <p>
            WanderHub collects account details (name, email, profile image), travel preferences, and
            activity data such as searches, favorites, and visits to provide personalized travel recommendations.
          </p>
          <p>
            We use your information to operate authentication, improve recommendations, and respond to support
            requests. We do not sell your personal information.
          </p>
          <p>
            Third-party services such as Google APIs may process limited request data to deliver maps, places,
            and AI features. Their usage is governed by their respective privacy terms.
          </p>
          <p>
            You may request deletion of your account and associated data by contacting support. We retain
            data only as long as needed for service operation, legal obligations, and security purposes.
          </p>
          <p>
            By using WanderHub, you agree to this Privacy Policy. We may update this page from time to time,
            and continued use means you accept the latest version.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
