"use client";
import { setUser } from "../redux/authSlice";
import { useGetMeQuery } from "../api/authApi";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import * as React from "react";
import { NavUser } from "./nav-user";
import { Logo } from "../components/logo";
import {
  AudioWaveform,
  Command,
  Home,
  UserCheck,
  Users,
  BarChart3,
  Folder,
  CheckSquare,
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
      title: "Home",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
  ];

  // Role-specific navigation
  const roleNav = {
    admin: {
      navMain: [
        ...commonMain,
        {
          title: "Create Employee",
          url: "/admin/employees/create",
          icon: UserCheck,
        },
        {
          title: "Analytics",
          url: "/admin/analytics",
          icon: BarChart3,
        },
      ],
    },
    project_manager: {
      navMain: [
        ...commonMain,
        {
          title: "Projects",
          url: "/manager/projects",
          icon: Folder,
          badge: "12",
        },
        {
          title: "Team",
          url: "/manager/team",
          icon: Users,
        },

        {
          title: "Tasks",
          url: "/manager/tasks",
          icon: CheckSquare,
          badge: "24",
        },
      ],
      navSecondary: [
        {
          title: "Reports",
          url: "/manager/reports",
          icon: BarChart3,
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
          badge: "7",
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
    teams: [
      {
        name: "Acme Inc",
        logo: Command,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
    ],
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

  // Show spinner while fetching
  if (isLoading || !user) return null;

  const dataRole = getRoleBasedData(user.role);

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader className="py-4">
        <Logo src="public/company.jpg" />
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
