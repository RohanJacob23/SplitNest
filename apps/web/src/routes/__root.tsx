import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { orpc } from "@/utils/orpc";
import "../index.css";
import Error404 from "@/components/pages/error";
import { useServerStatus } from "@/components/server-status";
import { getUser } from "@/query/get-user";

export interface RouterAppContext {
	orpc: typeof orpc;
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	beforeLoad: ({ context }) => {
		context.queryClient.prefetchQuery(getUser);
	},
	component: RootComponent,
	head: () => ({
		meta: [
			{
				title: "Split Nest",
			},
			{
				name: "description",
				content: "split-nest is a web application",
			},
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.ico",
			},
		],
	}),
	notFoundComponent: Error404,
	errorComponent: ({ error }) => {
		// Render an error message
		return (
			<main className="grid min-h-screen place-content-center space-y-2 text-center">
				<h1 className="scroll-m-20 text-balance font-extrabold text-4xl tracking-tight">
					Something went wrong!!
				</h1>
				<h2 className="scroll-m-20 font-semibold text-3xl tracking-tight first:mt-0">
					{error.message}
				</h2>
			</main>
		);
	},
});

function RootComponent() {
	useServerStatus();

	return (
		<>
			<HeadContent />
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				disableTransitionOnChange
				storageKey="split-nest-theme"
			>
				<Outlet />
				<Toaster
					richColors
					closeButton
					toastOptions={{
						style: { paddingBlock: "0.75rem", paddingInline: "1rem" },
					}}
				/>
			</ThemeProvider>
			<TanStackRouterDevtools position="bottom-left" />
			<ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
		</>
	);
}
