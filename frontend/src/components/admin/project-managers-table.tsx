"use client";
import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { GenericDataTable } from "@/components/generic-data-table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  IconDotsVertical,
  IconEdit,
  IconUserX,
  IconTrash,
  IconUserCheck,
} from "@tabler/icons-react";
import type { ProjectManager } from "@/data/mockProjectManagers";

/**
 * Define the columns specific to project managers.
 * Actions use inline DropdownMenu like your original EmployeesTable.
 */
const pmColumns: ColumnDef<ProjectManager>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        {/* Keep the header cell simple — GenericDataTable handles selection state */}
        <input type="checkbox" aria-label="Select all" className="opacity-0" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={() => row.toggleSelected()}
          aria-label={`Select ${row.original.fullname}`}
        />
      </div>
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "fullname",
    header: "Name",
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
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.department ?? "General"}
      </div>
    ),
  },
  {
    accessorKey: "teamSize",
    header: () => <div className="text-right">Team</div>,
    cell: ({ row }) => (
      <div className="w-20 text-right">{row.original.teamSize}</div>
    ),
  },
  {
    accessorKey: "activeProjects",
    header: () => <div className="text-right">Active Projects</div>,
    cell: ({ row }) => (
      <div className="text-right w-28">{row.original.activeProjects}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status;
      const variant =
        s === "Active"
          ? "secondary"
          : s === "Suspended"
          ? "destructive"
          : "outline";
      return <Badge variant={variant}>{s}</Badge>;
    },
  },
  {
    accessorKey: "lastActive",
    header: () => <div className="text-right">Last active</div>,
    cell: ({ row }) => (
      <div className="text-sm text-right text-muted-foreground">
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
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onSelect={() => alert(`Edit ${row.original.fullname}`)}
            >
              <IconEdit className="inline mr-2 size-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => alert(`Set on leave: ${row.original.fullname}`)}
            >
              <IconUserX className="inline mr-2 size-4" /> Set on leave
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                if (!confirm(`Remove ${row.original.fullname}?`)) return;
                alert(`${row.original.fullname} removed`);
              }}
              className="text-destructive"
            >
              <IconTrash className="inline mr-2 size-4" /> Remove
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => alert(`Resent invite to ${row.original.email}`)}
            >
              <IconUserCheck className="inline mr-2 size-4" /> Resend invite
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

export function ProjectManagersTable({ data }: { data: ProjectManager[] }) {
  return (
    <GenericDataTable<ProjectManager>
      data={data}
      columns={pmColumns}
      initialPageSize={10}
    />
  );
}
