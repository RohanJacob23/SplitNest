import { CustomLoaderIcon } from '@/icons/loader'

export default function DefaultPageLoading() {
  return (
    <div className="grid min-h-screen w-full place-content-center">
      <CustomLoaderIcon className="text-primary size-8 animate-spin duration-700" />
    </div>
  )
}
