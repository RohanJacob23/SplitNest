import { client } from '@/lib/hono-api'
import { sleep } from './get-user'
import { queryOptions } from '@tanstack/react-query'

const fetcher = async () => {
  await sleep(1500)
  const res = await client.invites.$get()
  return res.json()
}

export const getNotifications = queryOptions({
  queryKey: ['notifications'],
  queryFn: fetcher,
})
