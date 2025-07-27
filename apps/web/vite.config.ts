import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		tailwindcss(),
		tanstackRouter({ autoCodeSplitting: true }),
		react(),
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					gsap: ["gsap"],
					motion: ["motion/react"],
					zod: ["zod/v4"],
					lucidReact: ["lucide-react"],
					orpc: ["@orpc/client", "@orpc/server", "@orpc/tanstack-query"],
				},
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
