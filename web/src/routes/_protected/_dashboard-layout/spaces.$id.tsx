import Error404 from '@/components/pages/error'
import { getSpace } from '@/query/get-spaces'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_protected/_dashboard-layout/spaces/$id',
)({
  component: RouteComponent,
  loader: async ({ context, params: { id } }) => {
    const data = await context.queryClient.ensureQueryData(getSpace(id))

    console.log(data)

    if (!data) throw notFound()
  },
  notFoundComponent: Error404,
})

function RouteComponent() {
  const { id } = Route.useParams()

  const { data } = useSuspenseQuery(getSpace(id))

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6 p-4">
      <div>{data?.name}</div>
      <div>owner: {data?.owner?.name}</div>
    </section>
  )
}
