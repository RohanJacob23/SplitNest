import { CustomLoaderIcon } from "@/icons/loader";

export default function DefaultPageLoading() {
	return (
		<div className="grid min-h-screen w-full place-content-center">
			<CustomLoaderIcon className="size-8 animate-spin text-primary duration-700" />
		</div>
	);
}
