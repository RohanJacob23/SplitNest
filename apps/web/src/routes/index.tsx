import { createFileRoute } from "@tanstack/react-router";
import Cta from "@/components/sections/cta";
import Features from "@/components/sections/features";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";

export const Route = createFileRoute("/")({
	component: App,
});
export default function App() {
	return (
		<div className="min-h-screen bg-background text-foreground">
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
	);
}
