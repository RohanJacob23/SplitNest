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

const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(3, { error: 'Password should of minimum 3 words' }),
})

export default function LoginForm({
  className,
  ...props
}: ComponentProps<typeof Card>) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useAppForm({
    // Supports all useForm options
    defaultValues: {
      email: '',
      password: '',
    },
    validators: { onSubmit: loginFormSchema },
    onSubmit: async ({ value }) => {
      const loadingToast = toast.loading('Logging in...')
      await sleep(1500)

      await authClient.signIn.email(value, {
        onSuccess() {
          queryClient.removeQueries()
          toast.success('Logged in successfully', { id: loadingToast })
          navigate({ to: '/dashboard' })
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
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Login with your Apple or Google account
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
              Don&apos;t have an account?{' '}
              <Link to="/auth/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
