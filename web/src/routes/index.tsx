import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/sections/header'
import Hero from '@/components/sections/hero'
import Features from '@/components/sections/features'
import Cta from '@/components/sections/cta'
import Footer from '@/components/sections/footer'

export const Route = createFileRoute('/')({
  component: App,
})
export default function App() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* CTA Section */}
      <Cta />

      {/* Footer */}
      <Footer />
    </div>
  )
}
