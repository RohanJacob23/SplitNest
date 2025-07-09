import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { DollarSign, TrendingUp } from 'lucide-react'

export const Route = createFileRoute('/_protected/_dashboard-layout/dashboard')(
  {
    component: RouteComponent,
  },
)
// TODO: List of all subscriptions, Total monthly cost, Who paid what (and owes what), Button to “Add Subscription
function RouteComponent() {
  return (
    <section className="p-4">
      <div className="flex flex-wrap gap-4">
        {/* monthly total  */}
        <Card className="max-w-lg flex-auto gap-4">
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
        <Card className="max-w-lg flex-auto gap-4">
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
      </div>
    </section>
  )
}
