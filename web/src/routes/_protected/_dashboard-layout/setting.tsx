import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppForm } from '@/hooks/form'
import { getUser, sleep } from '@/query/get-user'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { User } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod/v4'

export const Route = createFileRoute('/_protected/_dashboard-layout/setting')({
  component: RouteComponent,
})

const updateUserProfileFormSchema = z.object({
  name: z.string().min(1, { error: 'Name is required' }),
  email: z.email(),
})

// TODO: User Settings (/settings), Name, email, theme switch, Email notification toggle, Billing (upgrade to Pro)
function RouteComponent() {
  const { data: user } = useSuspenseQuery(getUser)

  const form = useAppForm({
    defaultValues: { email: user?.email, name: user?.name },
    validators: { onSubmit: updateUserProfileFormSchema },
    onSubmit: async ({ value }) => {
      console.log(value)
      toast.promise(sleep(1500), {
        loading: 'Updating profile...',
        error: 'Error updating',
        success: 'Updated successfully',
      })
    },
  })

  return (
    <section className="space-y-6 p-4">
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <div className="flex items-center gap-6">
              <Avatar className="size-16">
                <AvatarFallback className="text-xl">
                  {user?.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{user?.name}</h3>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
                <Button variant="outline" size="sm" disabled className="mt-2">
                  Change Photo
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <form.AppField
                name="name"
                children={(field) => <field.TextField label="Name" />}
              />
              <form.AppField
                name="email"
                children={(field) => <field.TextField label="Email" />}
              />
            </div>

            <div className="w-full space-y-2">
              {/* TODO: update the db schema to add currency selector */}
              <Label htmlFor="currency">Default Currency</Label>
              <Select defaultValue="inr">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inr">₹ Indian Rupee (INR)</SelectItem>
                  <SelectItem value="usd">$ US Dollar (USD)</SelectItem>
                  <SelectItem value="eur">€ Euro (EUR)</SelectItem>
                  <SelectItem value="gbp">£ British Pound (GBP)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <form.AppForm>
              <form.SubmitButton label="Save changes" />
            </form.AppForm>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
