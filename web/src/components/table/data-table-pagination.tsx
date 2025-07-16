import type { Table } from '@tanstack/react-table'
import { Pagination, PaginationContent, PaginationItem } from '../ui/pagination'
import { Button } from '../ui/button'
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-end space-x-4 py-4">
      <p className="space-x-1 text-sm">
        <span>
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{' '}
          -{' '}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            table.getState().pagination.pageSize}
        </span>
        <span className="text-muted-foreground">of</span>
        <span>{table.getRowCount().toString()}</span>
      </p>

      <Pagination className="m-0 w-auto">
        <PaginationContent>
          {/* First page button */}
          <PaginationItem>
            <Button
              size="icon"
              variant="outline"
              className="disabled:pointer-events-none disabled:opacity-50"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Go to first page"
            >
              <ChevronFirstIcon size={16} aria-hidden="true" />
            </Button>
          </PaginationItem>
          {/* Previous page button */}
          <PaginationItem>
            <Button
              size="icon"
              variant="outline"
              className="disabled:pointer-events-none disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Go to previous page"
            >
              <ChevronLeftIcon size={16} aria-hidden="true" />
            </Button>
          </PaginationItem>
          {/* Next page button */}
          <PaginationItem>
            <Button
              size="icon"
              variant="outline"
              className="disabled:pointer-events-none disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Go to next page"
            >
              <ChevronRightIcon size={16} aria-hidden="true" />
            </Button>
          </PaginationItem>
          {/* Last page button */}
          <PaginationItem>
            <Button
              size="icon"
              variant="outline"
              className="disabled:pointer-events-none disabled:opacity-50"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Go to last page"
            >
              <ChevronLastIcon size={16} aria-hidden="true" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
