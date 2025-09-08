import {
  Warehouse,
  Home,
  Boxes,
  Box,
  Receipt,
  MoreHorizontal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Item Types",
    url: "/item-type",
    icon: Boxes,
  },
  {
    title: "Rooms",
    url: "/rooms",
    icon: Warehouse,
  },
  {
    title: "Items",
    url: "/items",
    icon: Box,
    submenuAction: [
      {
        title: "Add Item",
        url: "/items/new",
      },
    ],
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: Receipt,
    submenuAction: [
      {
        title: "Add Transaction",
        url: "/transactions/new",
      },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="bg-white">
        <SidebarHeader className="h-20 border-b border-zinc-200 flex flex-col justify-center p-5 font-sans">
          <h1 className="text-lg md:text-xl font-bold">Inventory</h1>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.submenuAction && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        {item.submenuAction.map((action) => (
                          <DropdownMenuItem key={action.title}>
                            <a href={action.url}>{action.title}</a>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
