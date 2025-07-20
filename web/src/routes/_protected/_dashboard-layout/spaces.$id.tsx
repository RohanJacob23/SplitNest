import CommingSoonCard from '@/components/comming-soon-card'
import Error404 from '@/components/pages/error'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getSpace } from '@/query/get-spaces'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'
import {
  CreditCard,
  DollarSign,
  Receipt,
  Settings,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react'

export const Route = createFileRoute(
  '/_protected/_dashboard-layout/spaces/$id',
)({
  component: RouteComponent,
  loader: async ({ context, params: { id } }) => {
    const data = await context.queryClient.ensureQueryData(getSpace(id))

    if (!data) throw notFound()
  },
  notFoundComponent: Error404,
})

function RouteComponent() {
  const { id } = Route.useParams()

  const { data: space } = useSuspenseQuery(getSpace(id))

  return (
    <section className="mx-auto w-full max-w-7xl space-y-4 p-4">
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="bg-primary-100 dark:bg-primary-950 flex size-8 items-center justify-center rounded-lg">
              <Users className="text-primary size-4" />
            </div>

            <CardTitle className="text-2xl capitalize">{space?.name}</CardTitle>
          </div>
          <CardAction className="row-start-2 flex items-center gap-4 justify-self-start">
            <Button variant="outline" size="sm" disabled>
              <Settings />
              Settings
            </Button>
            <Modal>
              <ModalTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserPlus />
                  Invite
                </Button>
              </ModalTrigger>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Invite Member</ModalTitle>
                </ModalHeader>
                {/* TODO: Add invite form */}
              </ModalContent>
            </Modal>
          </CardAction>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex gap-4">
            <Users className="size-6 shrink-0 text-emerald-500" />
            <div>
              <CardTitle>Members</CardTitle>
              {/* TODO: Add member count */}
              <CardDescription>12</CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex gap-4">
            <CreditCard className="size-6 shrink-0 text-blue-500" />
            <div>
              <CardTitle>Active Subscriptions</CardTitle>
              {/* TODO: Add subscription count */}
              <CardDescription>12</CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex gap-4">
            <DollarSign className="size-6 shrink-0 text-green-500" />
            <div>
              <CardTitle>Monthly Total</CardTitle>
              {/* TODO: Add monthly total */}
              <CardDescription>12</CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex gap-4">
            <TrendingUp className="size-6 shrink-0 text-purple-500" />
            <div>
              <CardTitle>Recent Purchases</CardTitle>
              {/* TODO: Add recent purchases */}
              <CardDescription>12</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewTabContent />
        </TabsContent>
        <TabsContent value="subscriptions">
          <CommingSoonCard />
        </TabsContent>
        <TabsContent value="purchases">
          <CommingSoonCard />
        </TabsContent>
        <TabsContent value="members">
          <CommingSoonCard />
        </TabsContent>
      </Tabs>
    </section>
  )
}

const OverviewTabContent = () => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Balances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="size-5 text-emerald-500" />
            <span>Current Balances</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid place-content-center space-y-3">
            <p className="text-muted-foreground">comming soon...</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="size-5 text-blue-500" />
            <span>Recent Purchases</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid place-content-center space-y-3">
            <p className="text-muted-foreground">comming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
