"use client";
import { setUser } from "../../redux/authSlice";
import { useGetMeQuery } from "@/redux/services/authApi";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import * as React from "react";
import { NavUser } from "./nav-user";
import { Logo } from "../logo";
import {
  LayoutDashboard,
  UserCheck,
  Users,
  FolderKanban,
  Folder,
  CheckSquare,
  ClipboardList,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";

// Role-based navigation data
const getRoleBasedData = (role: string) => {
  // Common items for all roles
  const commonMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
  ];

  // Role-specific navigation
  const roleNav = {
    admin: {
      navMain: [
        ...commonMain,
        {
          title: "Projects",
          url: "/admin/projects",
          icon: FolderKanban,
        },
        {
          title: "Project Managers",
          url: "/admin/project-managers",
          icon: Users,
        },
        {
          title: "Employees",
          url: "/admin/employees",
          icon: UserCheck,
        },
      ],
    },
    project_manager: {
      navMain: [
        ...commonMain,
        {
          title: "My Projects",
          url: "/project-manager/projects",
          icon: FolderKanban,
        },
        {
          title: "Assigned Tasks",
          url: "/project-manager/tasks",
          icon: ClipboardList,
        },
        {
          title: "Team Members",
          url: "/project-manager/employees",
          icon: Users,
        },
      ],
    },
    employee: {
      navMain: [
        ...commonMain,
        {
          title: "My Tasks",
          url: "/employee/tasks",
          icon: CheckSquare,
        },
        {
          title: "Projects",
          url: "/employee/projects",
          icon: Folder,
        },
      ],
    },
  };

  // Get role-specific data or default to employee
  const roleData = roleNav[role as keyof typeof roleNav] || roleNav.employee;

  return {
    navMain: roleData.navMain,
  };
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useAppDispatch();

  // Fetch current user from server using cookie
  const { data, isLoading } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data) {
      dispatch(setUser({ ...data, role: data.role.toLowerCase() }));
    }
  }, [data, dispatch]);

  const { user } = useAppSelector((state) => state.auth);

  if (isLoading || !user) return null;

  const dataRole = getRoleBasedData(user.role);

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader className="pt-2 pb-2">
        <Logo src="/company.jpg" />
        <NavMain items={dataRole.navMain} />
      </SidebarHeader>

      <SidebarContent></SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
