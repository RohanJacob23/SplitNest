import { getSpaces, type Space } from '@/query/get-spaces'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuButton,
  SidebarMenuAction,
} from './ui/sidebar'
import { ChevronDown, LayoutGrid, MoreHorizontal } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'
import { getUser, sleep } from '@/query/get-user'
import { toast } from 'sonner'
import { client } from '@/lib/hono-api'
import { useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useAppForm } from '@/hooks/form'
import { z } from 'zod/v4'

type DialogState = { type: 'edit' | 'delete'; space: Space[number] } | null

export default function SpacesSidebar() {
  const [dialog, setDialog] = useState<DialogState>(null)

  const { data: spaces } = useSuspenseQuery(getSpaces)
  const { data: user } = useSuspenseQuery(getUser)

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Spaces" asChild>
            <CollapsibleTrigger>
              <LayoutGrid />
              Spaces
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <CollapsibleContent>
        <SidebarMenuSub>
          {spaces.map((space, i) => (
            <SidebarMenuSubItem key={i}>
              <Link to="/spaces/$id" params={{ id: space.id.toString() }}>
                {({ isActive }) => (
                  <SidebarMenuSubButton isActive={isActive}>
                    {space.name}
                  </SidebarMenuSubButton>
                )}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction>
                    <MoreHorizontal />
                    <span className="sr-only">Add Project</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>

                <DropdownMenuContent side="right" align="start">
                  <DropdownMenuItem
                    onClick={() => setDialog({ type: 'edit', space })}
                    disabled={user?.id !== space.ownerId}
                  >
                    Edit Project
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setDialog({ type: 'delete', space })}
                    disabled={user?.id !== space.ownerId}
                  >
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuSubItem>
          ))}
          {dialog?.type === 'edit' && (
            <EditDialog
              open={true}
              onOpenChange={() => setDialog(null)}
              space={dialog.space}
            />
          )}

          {/* Single Delete Dialog */}
          {dialog?.type === 'delete' && (
            <DeleteDialog
              open={true}
              onOpenChange={() => setDialog(null)}
              space={dialog.space}
            />
          )}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

interface DialogProps {
  open: boolean
  onOpenChange: () => void
  space: Space[number]
}

const EditDialog = ({ space, ...props }: DialogProps) => {
  const queryClient = useQueryClient()

  const form = useAppForm({
    defaultValues: { name: space.name },
    validators: {
      onSubmit: z.object({
        name: z.string().min(1, { error: 'Name is required' }),
      }),
    },
    onSubmit: async ({ value, formApi }) => {
      await sleep(1500)

      if (formApi.state.isDefaultValue) {
        toast.warning('No changes made')
        return
      }

      const res = await client.spaces[':id'].$patch({
        param: { id: space.id.toString() },
        json: value,
      })

      const data = await res.json()

      toast.success(data.message)

      queryClient.invalidateQueries(getSpaces)

      props.onOpenChange()
    },
  })

  return (
    <AlertDialog {...props}>
      <AlertDialogContent asChild>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Name</AlertDialogTitle>
          </AlertDialogHeader>
          <form.AppField
            name="name"
            children={(field) => <field.TextField label="Name" />}
          />
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <form.AppForm>
                <form.SubmitButton label="Confirm" className="flex-1" />
              </form.AppForm>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const DeleteDialog = ({ space: { id }, ...props }: DialogProps) => {
  const queryClient = useQueryClient()

  const handleDelete = () => {
    toast.promise(
      async () => {
        const res = await client.spaces[':id'].$delete({
          param: { id: id.toString() },
        })
        await sleep(1500)
        return res.json()
      },
      {
        loading: 'Deleting space...',
        success: ({ message }) => {
          queryClient.invalidateQueries(getSpaces)
          return message
        },
        error: 'Error deleting space',
      },
    )
  }

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleDelete}>Continue</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
