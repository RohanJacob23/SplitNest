import { useSuspenseQuery } from '@tanstack/react-query'
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

export default function SpaceMemberTable({ id }: { id: string }) {
  const { data: members } = useSuspenseQuery(getSpaceMembers(id))

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
            {members.map(({ id, role, user }) => (
              <TableRow key={id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{user?.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user?.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>{role}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent side="right" align="start">
                      {/* TODO: implement */}
                      <DropdownMenuItem disabled>Remove</DropdownMenuItem>
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
