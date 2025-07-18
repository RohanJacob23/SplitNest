import { useAppForm } from '@/hooks/form'
import { z } from 'zod/v4'
import { ModalClose, ModalFooter } from '../ui/modal'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { client } from '@/lib/hono-api'
import { useQueryClient } from '@tanstack/react-query'
import { getSpaces } from '@/query/get-spaces'

export default function NewSpaceForm() {
  const queryClient = useQueryClient()

  const form = useAppForm({
    defaultValues: { name: '' },
    validators: {
      onSubmit: z.object({
        name: z.string().min(1, { error: 'Name is required' }),
      }),
    },
    onSubmit: async ({ value }) => {
      const loadingToast = toast.loading('Creating space...')

      const res = await client.spaces.$post({ json: value })

      if (!res.ok) {
        toast.error(res.statusText, { id: loadingToast })
        return
      }

      const data = await res.json()

      toast.success(data.message, { id: loadingToast })
      queryClient.invalidateQueries(getSpaces)

      form.reset()
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      <form.AppField
        name="name"
        children={(field) => <field.TextField label="Name" />}
      />

      <ModalFooter>
        <ModalClose asChild>
          <Button type="button" variant="outline" className="flex-1">
            Cancel
          </Button>
        </ModalClose>

        <form.AppForm>
          <form.SubmitButton label="Submit" className="flex-1" />
        </form.AppForm>
      </ModalFooter>
    </form>
  )
}
