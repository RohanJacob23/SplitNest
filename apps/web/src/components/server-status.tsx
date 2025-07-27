import { useEffect } from "react";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";

export function useServerStatus() {
	useEffect(() => {
		toast.promise(orpc.healthCheck.call(), {
			loading: "Checking server status...",
			success: "Server is up and running",
			error: "Error checking server status",
		});
	}, []);

	return;
}
