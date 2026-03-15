import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-10 flex-1 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
        <div className="bg-white rounded-lg border p-6 space-y-5 text-gray-700 leading-7">
          <p>
            By accessing WanderHub, you agree to use the service lawfully and in accordance with these terms.
            You are responsible for maintaining the confidentiality of your account credentials.
          </p>
          <p>
            WanderHub provides travel information and AI-generated guidance for planning purposes. Content may
            be incomplete or inaccurate, and you should verify critical details with official sources before travel.
          </p>
          <p>
            You may not misuse the platform, attempt unauthorized access, interfere with service operation,
            or use the service to violate applicable laws.
          </p>
          <p>
            We may suspend or terminate accounts that violate these terms. We may also modify or discontinue
            features at any time without prior notice.
          </p>
          <p>
            Continued use of WanderHub means you accept any updates to these terms. If you do not agree,
            discontinue use of the service.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
