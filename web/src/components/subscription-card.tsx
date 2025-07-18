// components/SubscriptionCard.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2 } from 'lucide-react'
import type { SubscriptionProps } from '@/routes/_protected/_dashboard-layout/subscription'

const statusVariants = {
  Paid: 'bg-green-100 text-green-600',
  Unpaid: 'bg-red-100 text-red-600',
  Pending: 'bg-yellow-100 text-yellow-600',
}

export default function SubscriptionCard({
  icon: Icon,
  name,
  amount,
  dueDate,
  paidBy,
  status,
  // split,
}: SubscriptionProps) {
  return (
    <Card className="shadow-sm transition-all duration-300 hover:shadow-md">
      <CardContent className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-3xl">
            <Icon />
          </div>
          <Badge variant="secondary">{status}</Badge>
        </div>

        <div>
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-muted-foreground text-sm">{amount}</p>
        </div>

        <div className="text-muted-foreground space-y-1 text-sm">
          <p>
            <span className="font-medium">Due:</span> {dueDate}
          </p>
          <p>
            <span className="font-medium">Paid By:</span> {paidBy}
          </p>
          <p>
            <span className="font-medium">Split:</span> {0}
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Pencil size={14} />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1"
          >
            <Trash2 size={14} />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
