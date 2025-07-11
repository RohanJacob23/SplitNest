import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Calendar, DollarSign, Edit, Trash2, Users } from 'lucide-react'
import type { SubscriptionProps } from '@/routes/_protected/_dashboard-layout/subscription'

const getDaysUntilDue = (dueDate: string) => {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
const getStatusColor = (status: string) => {
  return status === 'active'
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
}
const getCategoryColor = (category: string) => {
  const colors = {
    Entertainment: 'bg-secondary text-secondary-foreground',
    Utilities: 'bg-secondary text-secondary-foreground',
    Food: 'bg-secondary text-secondary-foreground',
    Insurance: 'bg-secondary text-secondary-foreground',
  }
  return (
    colors[category as keyof typeof colors] ||
    'bg-secondary text-secondary-foreground'
  )
}
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
export default function SubscriptionCard({
  icon: Icon,
  category,
  name,
  amount,
  dueDate,
  paidBy,
  splitPercentage,
}: SubscriptionProps) {
  const daysUntilDue = getDaysUntilDue(dueDate)
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-muted rounded-lg p-2">
              <Icon className="text-muted-foreground h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">{name}</h3>
              <Badge
                variant="outline"
                className={`text-xs ${getCategoryColor(category)}`}
              >
                {category}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Amount and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-2xl font-bold">${amount}</span>
            </div>
            <Badge className={getStatusColor(status)}>{status}</Badge>
          </div>

          {/* Due Date */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Due {formatDate(dueDate)}</span>
            </div>
            <span
              className={`font-medium ${
                daysUntilDue <= 3
                  ? 'text-red-600'
                  : daysUntilDue <= 7
                    ? 'text-orange-600'
                    : 'text-gray-600'
              }`}
            >
              {daysUntilDue > 0 ? `${daysUntilDue} days` : 'Overdue'}
            </span>
          </div>

          {/* Paid By and Split */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Paid by {paidBy}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-16 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{
                    width: `${splitPercentage}%`,
                  }}
                />
              </div>
              <span className="ml-1 text-xs font-medium">
                {splitPercentage}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
