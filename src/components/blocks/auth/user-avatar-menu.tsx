"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Settings } from "lucide-react";
import LogOut from "./logout";
import { getInitials } from "@/lib/utils";
import type { User } from "next-auth";
import { useRouter } from "next/navigation";

type UserAvatarMenuProps = {
  user: User | undefined;
};
const UserAvatarMenu = ({ user }: UserAvatarMenuProps) => {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {!!user ? (
          <Avatar>
            <AvatarImage src={user.image!} alt={"@" + user.name} />
            <AvatarFallback>{getInitials(user.name!)}</AvatarFallback>
          </Avatar>
        ) : (
          <MoreVertical className="size-4" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {!!user && (
          <>
            <DropdownMenuLabel>{user.name!}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings />
          Settings
        </DropdownMenuItem>
        {!!user && (
          <DropdownMenuItem asChild>
            <LogOut />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserAvatarMenu;
