"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  sidebarMenuButtonVariants,
} from "@/components/ui/sidebar";

import { NAV_DEFS, VIEW_TITLES, type View } from "./data";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeView = (NAV_DEFS.find((n) => pathname.startsWith(n.href))?.id ?? "orders") as View;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-3">
          <div className="px-1.5 py-1">
            <div className="text-base font-extrabold">Baan Baan Kitchen</div>
            <div className="mt-0.5 text-xs text-muted-foreground">พอร์ทัลผู้จัดการ</div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {NAV_DEFS.map((nav) => (
                <SidebarMenuItem key={nav.id}>
                  <Link
                    href={nav.href}
                    data-active={nav.id === activeView}
                    className={cn(sidebarMenuButtonVariants(), "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground")}
                  >
                    <nav.Icon />
                    <span>{nav.label}</span>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/scan" className={sidebarMenuButtonVariants()}>
                <span>ดูแอปลูกค้า</span>
                <ArrowUpRight className="ml-auto size-3.5 text-muted-foreground" />
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{VIEW_TITLES[activeView]}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
