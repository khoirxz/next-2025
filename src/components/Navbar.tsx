"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { useLogout } from "@/hooks/useLogout";
import { Button } from "./ui/button";

interface NavbarProps {
  title?: string;
}

export default function Navbar({ title }: NavbarProps) {
  const logout = useLogout();

  return (
    <nav className="font-sans sticky top-0 w-full">
      <div className="flex justify-between items-center gap-4 h-20 border-b border-zinc-200 p-5 bg-white">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-lg md:text-xl font-bold">{title}</h1>
        </div>

        <Popover>
          <PopoverTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-28">
            <Button onClick={() => logout.mutate()} variant="link">
              {" "}
              {logout.isPending ? "Logging out…" : "Logout"}
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
