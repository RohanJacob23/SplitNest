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
import { useAppForm } from '@/hooks/form'
import { z } from 'zod/v4'

type DialogState = {
  type: 'edit' | 'delete'
  spaceMember: Space[number]
} | null

export default function SpacesSidebar() {
  const [dialog, setDialog] = useState<DialogState>(null)

  const { data } = useSuspenseQuery(getSpaces)

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
        {data.length > 0 ? (
          <SidebarMenuSub>
            {data.map((spaceMember, i) => (
              <SidebarMenuSubItem key={i}>
                <Link
                  to="/spaces/$id"
                  params={{ id: spaceMember.spaceId!.toString() }}
                >
                  {({ isActive }) => (
                    <SidebarMenuSubButton isActive={isActive}>
                      {spaceMember.space?.name}
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
                      onClick={() => setDialog({ type: 'edit', spaceMember })}
                      disabled={spaceMember.role !== 'admin'}
                    >
                      Edit Project
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setDialog({ type: 'delete', spaceMember })}
                      disabled={spaceMember.role !== 'admin'}
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
                spaceMember={dialog.spaceMember}
              />
            )}

            {/* Single Delete Dialog */}
            {dialog?.type === 'delete' && (
              <DeleteDialog
                open={true}
                onOpenChange={() => setDialog(null)}
                spaceMember={dialog.spaceMember}
              />
            )}
          </SidebarMenuSub>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>You have no spaces</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

interface DialogProps {
  open: boolean
  onOpenChange: () => void
  spaceMember: Space[number]
}

const EditDialog = ({ spaceMember, ...props }: DialogProps) => {
  const queryClient = useQueryClient()

  const form = useAppForm({
    defaultValues: { name: spaceMember.space?.name },
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

      if (!spaceMember.spaceId) return

      const res = await client.spaces[':id'].$patch({
        param: { id: spaceMember.spaceId.toString() },
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

const DeleteDialog = ({
  spaceMember: { spaceId, role },
  ...props
}: DialogProps) => {
  const queryClient = useQueryClient()

  const handleDelete = () => {
    if (!spaceId) return

    if (role !== 'admin') {
      toast.warning('You must be an admin to delete a space')
      return
    }

    toast.promise(
      async () => {
        const res = await client.spaces[':id'].$delete({
          param: { id: spaceId.toString() },
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
