"use client";
import { User, Settings2, MessageCircleQuestion, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function NavUser({ user }: NavUserProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left hover:bg-accent focus:bg-accent"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
            />
            <AvatarFallback>
              {(user.firstName || user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.email
              )
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center gap-2">
            <User className="w-4 h-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <Settings2 className="w-4 h-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <MessageCircleQuestion className="w-4 h-4" /> Help
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
