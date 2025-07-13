import { createFileRoute } from '@tanstack/react-router'
import { Clock, DollarSign, TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Route = createFileRoute('/_protected/_dashboard-layout/dashboard')(
  {
    component: RouteComponent,
  },
)

const netBalance = 1000

function RouteComponent() {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-6 p-4">
      <div className="flex flex-wrap gap-4">
        {/* monthly total  */}
        <Card className="max-w-sm flex-auto gap-4">
          <CardHeader>
            <CardDescription>Monthly Total</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums">
              ₹3,547
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp className="text-green-600" />
                +2.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              High spend this month{' '}
              <TrendingUp className="size-4 text-green-600" />
            </div>
            <div className="text-muted-foreground">+2.5% from last month</div>
          </CardFooter>
        </Card>

        {/* active subscription */}
        <Card className="max-w-sm flex-auto gap-4">
          <CardHeader>
            <CardDescription>Active Subscriptions:</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums">
              4
            </CardTitle>
            <CardAction>
              <DollarSign />
            </CardAction>
            <CardDescription>2 due this month</CardDescription>
          </CardHeader>
        </Card>

        {/* all pending payments */}
        <Card className="max-w-sm flex-auto gap-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <Clock className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹3000</div>
            <p className="text-muted-foreground text-xs">Awaiting settlement</p>
          </CardContent>
        </Card>

        {/* net balance */}
        <Card className="max-w-sm flex-auto gap-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            {netBalance >= 0 ? (
              <TrendingUp className="size-4 text-green-600" />
            ) : (
              <TrendingDown className="size-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{Math.abs(netBalance).toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              {netBalance > 0
                ? 'Alex owes you'
                : netBalance < 0
                  ? 'You owe Alex'
                  : 'All settled'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* tabs */}
      <Tabs defaultValue="account">
        <TabsList className="w-full">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader>
              <CardTitle>Make changes to your account here.</CardTitle>
              <CardDescription>
                Make changes to your account here.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader>
              <CardTitle>Change your password here.</CardTitle>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent value="test">
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader>
              <CardTitle>Test your password here.</CardTitle>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
