import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { NavActions } from "@/components/sidebar/nav-actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function PageLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex items-center gap-2 h-14 shrink-0">
          <div className="flex items-center flex-1 gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    Project Management Dashboard
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="px-3 ml-auto">
            <NavActions />
          </div>
        </header>

        <div className="flex flex-col flex-1 gap-4 px-4 py-10">
          <Outlet /> {/* dynamic page content here */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
