import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { client } from '@/lib/hono-api'
import { getNotifications } from '@/query/get-notifications'
import { getSpaces } from '@/query/get-spaces'
import { sleep } from '@/query/get-user'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Bell } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute(
  '/_protected/_dashboard-layout/notification',
)({
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData(getNotifications),
  component: RouteComponent,
})

function RouteComponent() {
  const { data: notifications } = useSuspenseQuery(getNotifications)

  const queryClient = useQueryClient()

  const [isLoading, setIsLoading] = useState(false)

  const handleAccept = (id: number) => {
    setIsLoading(true)
    toast.promise(
      async () => {
        await sleep(1500)

        const res = await client.invites[':inviteId'].accept.$post({
          param: { inviteId: id.toString() },
        })

        return res.json()
      },
      {
        loading: 'Accepting invite...',
        success: ({ message }) => {
          setIsLoading(false)

          queryClient.invalidateQueries(getNotifications)
          queryClient.invalidateQueries(getSpaces)

          return message
        },
        error: 'Error accepting invite',
      },
    )
  }

  const handleDecline = (id: number) => {
    setIsLoading(true)
    toast.promise(
      async () => {
        await sleep(1500)

        const res = await client.invites[':inviteId'].decline.$post({
          param: { inviteId: id.toString() },
        })

        return res.json()
      },
      {
        loading: 'Declining invite...',
        success: ({ message }) => {
          setIsLoading(false)

          queryClient.invalidateQueries(getNotifications)

          return message
        },
        error: 'Error declining invite',
      },
    )
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Bell className="size-5 text-emerald-500" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="border-t pt-4">
          {notifications.length === 0 && (
            <h1 className="text-muted-foreground text-xl">No notifications</h1>
          )}

          {notifications.map((notif) => (
            <Card key={notif.id}>
              <CardHeader className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                <div className="space-y-2">
                  <CardTitle>Space: {notif.space.name}</CardTitle>
                  <CardDescription>
                    Adimin:{' '}
                    <span className="inline-flex gap-1">
                      <span>{notif.space.owner?.name}</span>
                      <span>{notif.space.owner?.email}</span>
                    </span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleAccept(notif.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => handleDecline(notif.id)}
                  >
                    Decline
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
