"use client";
import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { GenericDataTable } from "../generic-data-table";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  IconDotsVertical,
  IconTrash,
  IconEdit,
  IconUserCheck,
  IconUserX,
} from "@tabler/icons-react";
import { toast } from "sonner";

/**
 * Schema and types for an employee row
 */
export const employeeSchema = z.object({
  id: z.number(),
  fullname: z.string(),
  email: z.string().email(),
  role: z.string(),
  status: z.enum(["Active", "Suspended", "Invited"]).default("Active"),
  lastActive: z.string().optional(),
});

export type Employee = z.infer<typeof employeeSchema>;

/**
 * Employees-specific columns — these are passed into GenericDataTable.
 * Note: header renderers receive a `table` context from GenericDataTable's useReactTable instance.
 */
const employeeColumns: ColumnDef<Employee>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(val) => row.toggleSelected(!!val)}
          aria-label={`Select ${row.original.fullname}`}
        />
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "fullname",
    header: "Full name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="font-medium">{row.original.fullname}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.email}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div className="capitalize">{row.original.role}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant =
        status === "Active"
          ? "secondary"
          : status === "Suspended"
          ? "destructive"
          : "outline";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "lastActive",
    header: () => <div className="text-right">Last active</div>,
    cell: ({ row }) => (
      <div className="text-sm text-right w-28 text-muted-foreground">
        {row.original.lastActive ?? "—"}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <IconDotsVertical />
              <span className="sr-only">Open actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onSelect={() => {
                toast.success(`Edit ${row.original.fullname}`);
              }}
            >
              <IconEdit className="inline mr-2 size-4" />
              Edit user
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                toast.promise(
                  new Promise((resolve) => setTimeout(resolve, 700)),
                  {
                    loading: `Suspending ${row.original.fullname}...`,
                    success: `${row.original.fullname} suspended`,
                    error: "Something went wrong",
                  }
                );
              }}
            >
              <IconUserX className="inline mr-2 size-4" />
              Suspend user
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                if (
                  !confirm(
                    `Delete ${row.original.fullname}? This cannot be undone.`
                  )
                ) {
                  return;
                }
                toast.promise(
                  new Promise((resolve) => setTimeout(resolve, 700)),
                  {
                    loading: `Deleting ${row.original.fullname}...`,
                    success: `${row.original.fullname} deleted`,
                    error: "Failed to delete",
                  }
                );
              }}
              className="text-destructive"
            >
              <IconTrash className="inline mr-2 size-4" />
              Delete user
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                toast.success(`Password reset sent to ${row.original.email}`)
              }
            >
              <IconUserCheck className="inline mr-2 size-4" />
              Reset password
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

export function EmployeesTable({ data }: { data: Employee[] }) {
  // Use GenericDataTable for core behavior (filter/pagination/selection).
  // We pass in employees-specific columns and provide an onBulkDelete handler
  // that uses toast and confirmation before removing (demo only).
  function handleBulkDelete(selected: Employee[]) {
    if (selected.length === 0) {
      toast.error("No users selected");
      return;
    }
    if (!confirm(`Delete ${selected.length} selected user(s)?`)) return;
    toast.promise(
      new Promise<void>((resolve) => {
        setTimeout(resolve, 700);
      }).then(() => {
        // In a real app you'd call an API. Here we simply show a success toast.
        toast.success("Deleted");
      }),
      {
        loading: "Deleting selected users...",
        success: "Deleted",
        error: "Failed to delete",
      }
    );
  }

  return (
    <GenericDataTable<Employee>
      data={data}
      columns={employeeColumns}
      initialPageSize={10}
      onBulkDelete={handleBulkDelete}
    />
  );
}
