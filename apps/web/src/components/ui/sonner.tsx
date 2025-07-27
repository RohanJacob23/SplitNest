import type { ToasterProps } from "sonner";
import { Toaster as Sonner } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "../theme-provider";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	const isMobile = useIsMobile();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
				} as React.CSSProperties
			}
			position={isMobile ? "top-center" : "bottom-right"}
			{...props}
		/>
	);
};

export { Toaster };
