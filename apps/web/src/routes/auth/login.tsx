import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "@/components/form/login-form";

export const Route = createFileRoute("/auth/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="grid min-h-screen place-items-center p-2">
			<LoginForm className="w-full max-w-sm" />
		</main>
	);
}
