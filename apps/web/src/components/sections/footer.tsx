import { Link } from "@tanstack/react-router";
import { GithubIcon, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
	return (
		<footer className="border-t px-6 py-16">
			<div className="mx-auto max-w-6xl">
				<div className="mb-8 flex flex-col items-center justify-between md:flex-row">
					<div className="mb-6 flex items-center space-x-3 md:mb-0">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
							<div className="h-3 w-3 rounded-sm bg-background" />
						</div>
						<span className="font-medium text-xl">Split Nest</span>
					</div>

					<div className="flex items-center space-x-6">
						<Link
							to="/"
							className="text-muted-foreground hover:text-foreground"
						>
							<GithubIcon className="h-5 w-5" />
						</Link>
						<Link
							to="/"
							className="text-muted-foreground hover:text-foreground"
						>
							<Twitter className="h-5 w-5" />
						</Link>
						<Link
							to="/"
							className="text-muted-foreground hover:text-foreground"
						>
							<Linkedin className="h-5 w-5" />
						</Link>
					</div>
				</div>

				<div className="border-t pt-8 text-center">
					<p className="font-light text-muted-foreground text-sm">
						© {new Date().getFullYear()} Split Nest. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
