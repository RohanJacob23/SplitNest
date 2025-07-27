import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { Suspense, useState } from "react";
import { cn } from "@/lib/utils";
import { getUser } from "@/query/get-user";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const items = [
	{
		name: "Features",
		to: "/",
		hash: "features",
	},
	{
		name: "Pricing",
		to: "/",
		hash: "pricing",
	},
	{
		name: "About",
		to: "/",
		hash: "about",
	},
];

export default function Header() {
	const [isScrolled, setIsScrolled] = useState(false);

	const { scrollY } = useScroll();

	useMotionValueEvent(scrollY, "change", (latest) => {
		setIsScrolled(latest > 50);
	});

	return (
		<header
			className={cn(
				"sticky top-0 z-50 mx-4 max-w-7xl translate-y-0 transition-[transform_max-width] duration-300 ease-in-out sm:mx-auto",
				isScrolled && "max-w-5xl translate-y-2",
			)}
		>
			<nav
				className={cn(
					"mx-auto flex h-16 max-w-7xl items-center justify-between bg-background/60 px-6 backdrop-blur-3xl",
					isScrolled &&
						"rounded-2xl border border-primary/50 border-dashed dark:border-primary/15",
				)}
			>
				<div className="flex items-center space-x-3">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
						<div className="h-3 w-3 rounded-sm bg-background" />
					</div>
					<span className="font-medium text-xl">Split Nest</span>
				</div>

				<div className="hidden items-center space-x-8 md:flex">
					{items.map((item) => (
						<Link
							key={item.name}
							to={item.to}
							hash={item.hash}
							className="font-medium text-base text-muted-foreground transition-colors duration-300 hover:text-primary"
						>
							{item.name}
						</Link>
					))}
				</div>

				<Suspense fallback={<Skeleton className="h-9 w-24" />}>
					<AuthSection />
				</Suspense>
			</nav>
		</header>
	);
}

const AuthSection = () => {
	const { data } = useSuspenseQuery(getUser);

	if (data)
		return (
			<Button className="group gap-1" asChild>
				<Link to="/dashboard">
					Dashboard
					<ArrowRight className="transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
				</Link>
			</Button>
		);

	return (
		<div className="space-x-2">
			<Button variant="outline" asChild>
				<Link to="/auth/login">Sign In</Link>
			</Button>
			<Button asChild>
				<Link to="/auth/sign-up">Get Started</Link>
			</Button>
		</div>
	);
};
