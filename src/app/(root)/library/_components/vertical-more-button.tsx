"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { removePlaylist } from "@/db/queries";
import { MoreVertical, Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const VerticalMoreButton = ({
  playlistId,
  userId,
  playlistName,
}: {
  playlistId: string;
  userId?: string;
  playlistName: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="hover:text-primary" size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            toast("Are you sure you want to delete this playlist?", {
              action: {
                label: "Yes",
                onClick: () =>
                  toast.promise(removePlaylist(userId!, playlistId), {
                    success: `"${playlistName}" has been removed.`,
                    error: (e) => e.message,
                  }),
              },
            });
          }}
        >
          <Trash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VerticalMoreButton;
