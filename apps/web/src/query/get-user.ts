import { queryOptions } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const sleep = async (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

const fetcher = async () => authClient.getSession();

export const getUser = queryOptions({
	queryKey: ["user-auth"],
	queryFn: fetcher,
	select: (response) => response.data?.user,
});
