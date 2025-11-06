"use client";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  VisibilityState,
  SortingState,
  ColumnFiltersState,
  ColumnDef,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconSearch } from "@tabler/icons-react";

type GenericDataTableProps<T extends { id: number | string }> = {
  data: T[];
  columns: ColumnDef<T>[];
  initialPageSize?: number;
  className?: string;
  /**
   * Optional callback invoked when the user triggers the built-in bulk delete action.
   * If provided, GenericDataTable will call this with the selected rows (original data objects).
   * If omitted, GenericDataTable will perform a local deletion (for dev/visual purposes).
   */
  onBulkDelete?: (selected: T[]) => void;
};

export function GenericDataTable<T extends { id: number | string }>({
  data: initialData,
  columns,
  initialPageSize = 10,
  className,
  onBulkDelete,
}: GenericDataTableProps<T>) {
  const [data, setData] = React.useState<T[]>(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [globalFilter, setGlobalFilter] = React.useState("");

  React.useEffect(() => {
    // Keep local copy in sync when parent provides new data
    setData(initialData);
  }, [initialData]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => String((row as any).id),
  });

  function handleBulkDelete() {
    const selectedRowModel = table.getSelectedRowModel();
    const selectedRows = selectedRowModel.rows.map((r) => r.original);

    if (selectedRows.length === 0) {
      // no-op (caller likely uses toast)
      return;
    }

    if (onBulkDelete) {
      onBulkDelete(selectedRows);
      return;
    }

    // default local deletion
    if (
      !confirm(
        `Delete ${selectedRows.length} selected item(s)? This cannot be undone.`
      )
    )
      return;
    const selectedMap = selectedRowModel.rows.reduce<Record<string, boolean>>(
      (acc, r) => {
        acc[r.id] = true;
        return acc;
      },
      {}
    );
    setData((d) => d.filter((r) => !selectedMap[String((r as any).id)]));
    setRowSelection({});
  }

  return (
    <div className={`flex flex-col gap-4 w-full ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-2 px-2">
        <div className="flex items-center w-full max-w-lg gap-2">
          <Label htmlFor="table-search" className="sr-only">
            Search
          </Label>
          <div className="relative w-full">
            <Input
              id="table-search"
              placeholder="Search..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <IconSearch className="absolute right-3 top-3 size-4 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleBulkDelete}>
            Delete selected
          </Button>
        </div>
      </div>

      <div className="overflow-hidden border rounded-lg">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table
              .getRowModel()
              .rows.filter((r) => {
                if (!globalFilter) return true;
                const q = globalFilter.toLowerCase();
                return Object.values(r.original).some((val) => {
                  if (val == null) return false;
                  return String(val).toLowerCase().includes(q);
                });
              })
              .slice(
                table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize,
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize
              )
              .map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} selected
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            ◀
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            ▶
          </Button>
        </div>
      </div>
    </div>
  );
}
