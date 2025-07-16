import { createColumnHelper, type FilterFn } from '@tanstack/react-table'
import type { Expense } from '@/lib/mock-dashboard-expenses'
import { Badge } from '@/components/ui/badge'

const multiColumnFilterFn: FilterFn<Expense> = (row, _, filterValue) => {
  const searchableRowContent =
    `${row.original.category} ${row.original.description}`.toLowerCase()

  const searchTerm = (filterValue ?? '').toLowerCase()
  return searchableRowContent.includes(searchTerm)
}

const statusFilterFn: FilterFn<Expense> = (
  row,
  columnId,
  filterValue: string[],
) => {
  if (!filterValue?.length) return true

  const status = row.getValue(columnId) as string
  return filterValue.includes(status)
}

const columnHelper = createColumnHelper<Expense>()

const customBadge = (value: string) => {
  switch (value) {
    case 'paid':
      return (
        <Badge variant="outline" className="gap-1.5 rounded-full">
          <span
            className="size-1.5 rounded-full bg-emerald-500"
            aria-hidden="true"
          ></span>
          Paid
        </Badge>
      )
    case 'pending':
      return (
        <Badge variant="outline" className="gap-1.5 rounded-full">
          <span
            className="size-1.5 rounded-full bg-amber-500"
            aria-hidden="true"
          ></span>
          Pending
        </Badge>
      )
    case 'due':
      return (
        <Badge variant="outline" className="gap-1.5 rounded-full">
          <span
            className="size-1.5 rounded-full bg-red-500"
            aria-hidden="true"
          ></span>
          Due
        </Badge>
      )
    default:
      return <Badge>Unknown</Badge>
  }
}

export const defaultExpenseColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    cell: (info) => info.getValue(),
    filterFn: multiColumnFilterFn,
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('owedAmount', {
    header: 'Owed Amount',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('owedBy', {
    header: 'Owed By',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('paidBy', {
    header: 'Paid By',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    cell: (info) => customBadge(info.getValue()),
    filterFn: statusFilterFn,
  }),
]
