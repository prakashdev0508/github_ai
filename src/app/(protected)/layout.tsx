import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserButton, UserProfile } from "@clerk/nextjs";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="p-2">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <header className="flex  justify-between h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
              </div>
              <div className=" mr-5 mt-2">
              <UserButton />
              </div>
            </header>
          </div>
          <div className="flex flex-1 mt-3 flex-col gap-4 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
