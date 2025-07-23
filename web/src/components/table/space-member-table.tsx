import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { getSpaceMembers } from '@/query/get-space-members'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { client } from '@/lib/hono-api'
import { getUser } from '@/query/get-user'

export default function SpaceMemberTable({ id }: { id: string }) {
  const { data: members } = useSuspenseQuery(getSpaceMembers(id))
  const { data: user } = useSuspenseQuery(getUser)

  const queryClient = useQueryClient()

  const handleRemoveMember = (memberId: string) => {
    toast.promise(
      async () => {
        const res = await client.spaces.members[':memberId'].$delete({
          param: { memberId },
        })

        return res.json()
      },
      {
        loading: 'Removing member...',
        success: ({ message }) => {
          queryClient.invalidateQueries(getSpaceMembers(id))
          return message
        },
        error: 'Error removing member',
      },
    )
  }

  return (
    <Card>
      <CardContent className="grid">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{member.user?.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.user?.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{member.user?.email}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent side="bottom" align="end">
                      {/* TODO: implement */}
                      <DropdownMenuItem
                        onClick={() => handleRemoveMember(member.id.toString())}
                        disabled={
                          user?.id !== member.space?.ownerId ||
                          member.space?.ownerId === member.userId
                        }
                      >
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
