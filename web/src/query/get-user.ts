import { authClient } from '@/lib/auth-client'
import { queryOptions } from '@tanstack/react-query'

export const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

const fetcher = async () => {
  await sleep(1500)
  return authClient.getSession()
}

export const getUser = queryOptions({
  queryKey: ['user-auth'],
  queryFn: fetcher,
  select: (response) => response.data?.user,
})
