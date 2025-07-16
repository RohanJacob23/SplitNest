import { Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod/v4'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import type { ComponentProps } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAppForm } from '@/hooks/form'
import { GithubIcon } from '@/icons/logo/github'
import { GoogleIcon } from '@/icons/logo/google'
import { authClient } from '@/lib/auth-client'
import { getUser, sleep } from '@/query/get-user'

const signUpFormSchema = z.object({
  name: z.string().min(1, { error: 'Name is required' }),
  email: z.email(),
  password: z.string().min(3, { error: 'Password should of minimum 3 words' }),
})

export default function SignUpForm({
  className,
  ...props
}: ComponentProps<typeof Card>) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useAppForm({
    // Supports all useForm options
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    validators: { onSubmit: signUpFormSchema },
    onSubmit: async ({ value }) => {
      const loadingToast = toast.loading('Siging up...')

      await sleep(1500)

      await authClient.signUp.email(value, {
        onSuccess() {
          queryClient.removeQueries(getUser)
          toast.success('Signed up successfully', { id: loadingToast })
          navigate({ to: '/dashboard', reloadDocument: true })
        },
        onError(context) {
          toast.error(context.error.message, { id: loadingToast })
        },
      })
    },
  })

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create Account</CardTitle>
        <CardDescription>
          Welcome! Create an account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                className="w-full"
                type="button"
                disabled
              >
                <GithubIcon />
                Login with Github
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                disabled
              >
                <GoogleIcon />
                Login with Google
              </Button>
            </div>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>
            <div className="grid gap-6">
              <form.AppField
                name="name"
                children={(field) => <field.TextField label="Name" />}
              />
              <form.AppField
                name="email"
                children={(field) => <field.TextField label="Email" />}
              />
              <form.AppField
                name="password"
                children={(field) => (
                  <field.TextField label="Password" type="password" />
                )}
              />

              <form.AppForm>
                <form.SubmitButton label="Login" />
              </form.AppForm>
            </div>
            <div className="text-center text-sm">
              Have an account ?{' '}
              <Link to="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
