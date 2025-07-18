import { queryOptions } from '@tanstack/react-query'
import { sleep } from './get-user'
import { client } from '@/lib/hono-api'

const spacesFetcher = async () => {
  await sleep(1500)

  const res = await client.spaces.$get()

  return res.json()
}

export type Space = Awaited<ReturnType<typeof spacesFetcher>>

export const getSpaces = queryOptions({
  queryKey: ['spaces'],
  queryFn: spacesFetcher,
})

const spaceFetcher = async (id: string) => {
  await sleep(1500)

  const res = await client.spaces[':id'].$get({ param: { id } })

  if (!res.ok) return null

  return res.json()
}

export const getSpace = (id: string) =>
  queryOptions({
    queryKey: ['space', id],
    queryFn: () => spaceFetcher(id),
  })
