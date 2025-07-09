import { Loader } from 'lucide-react'

export default function DefaultPageLoading() {
  return (
    <div className="grid min-h-screen w-full place-content-center">
      <Loader className="text-primary size-8 animate-spin" />
    </div>
  )
}
