import { client } from '@/lib/hono-api'
import { queryOptions } from '@tanstack/react-query'
import { sleep } from './get-user'

const fetcher = async (spaceId: string) => {
  await sleep(2000)

  const res = await client.spaces[':spaceId'].members.$get({
    param: { spaceId },
  })

  return res.json()
}

export type SpaceMember = Awaited<ReturnType<typeof fetcher>>

export const getSpaceMembers = (spaceId: string) =>
  queryOptions({
    queryKey: ['space-members', spaceId],
    queryFn: () => fetcher(spaceId),
  })
