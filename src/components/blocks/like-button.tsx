"use client";
import { Library } from "@/db/schema";
import { Album, Artist, Playlist, Type } from "@/types";
import { User } from "next-auth";
import React, { HTMLAttributes, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { addToLibrary, getUserLibrary, removeFromLibrary } from "@/db/queries";
import { cn, showLoginError } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type LikeButtonProps = HTMLAttributes<HTMLButtonElement> & {
  user?: User;
  type: Type;
  library?: Library;
  token: string;
  name: string;
  item?: Album | Playlist | Artist;
};
const LikeButton = ({
  user,
  type,
  // library,
  token,
  name,
  className,
  item,
  ...rest
}: LikeButtonProps) => {
  const { data: library } = useQuery({
    queryKey: ["library", user?.id],
    queryFn: ({ queryKey }) => getUserLibrary(queryKey[1]!),
    enabled: !!user?.id,
  });
  const queryClient = useQueryClient();
  const isLikedItem = !!(
    library?.songs?.includes(token) ||
    library?.albums.some((album) => album.id === token) ||
    library?.playlists.some((playlist) => playlist.id === token) ||
    library?.artists.some((artist) => artist.id === token)
  );

  const [pendingLikeTransition, startLikeTransition] = useTransition();
  const onAddSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["library", user?.id] });
    return `"${name}" added to library`;
  };
  const onRemoveSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["library", user?.id] });
    return `"${name}" removed from library`;
  };
  const handleLike = () => {
    if (!user) {
      showLoginError();
      return;
    }
    startLikeTransition(() => {
      switch (type) {
        case "song": {
          if (library?.songs?.includes(token)) {
            toast.promise(removeFromLibrary(user.id!, token, type), {
              loading: "Removing from library",
              success: onRemoveSuccess,
              error: (e) => e.message,
            });
          } else {
            toast.promise(addToLibrary(user.id!, token, type), {
              loading: "Adding to library",
              success: onAddSuccess,
              error: (e) => e.message,
            });
          }
          break;
        }
        case "album": {
          if (library?.albums?.some((album) => album.id === token)) {
            toast.promise(removeFromLibrary(user.id!, token, type), {
              loading: "Removing from library",
              success: onRemoveSuccess,
              error: (e) => e.message,
            });
          } else {
            toast.promise(addToLibrary(user.id!, token, type, item!), {
              loading: "Adding to library",
              success: onAddSuccess,
              error: (e) => e.message,
            });
          }
          break;
        }
        case "playlist": {
          if (library?.playlists?.some((playlist) => playlist.id === token)) {
            toast.promise(removeFromLibrary(user.id!, token, type), {
              loading: "Removing from library",
              success: onRemoveSuccess,
              error: (e) => e.message,
            });
          } else {
            toast.promise(addToLibrary(user.id!, token, type, item!), {
              loading: "Adding to library",
              success: onAddSuccess,
              error: (e) => e.message,
            });
          }
          break;
        }
        case "artist": {
          if (library?.artists?.some((artist) => artist.id === token)) {
            toast.promise(removeFromLibrary(user.id!, token, type), {
              loading: "Removing from library",
              success: onRemoveSuccess,
              error: (e) => e.message,
            });
          } else {
            toast.promise(addToLibrary(user.id!, token, type, item!), {
              loading: "Adding to library",
              success: onAddSuccess,
              error: (e) => e.message,
            });
          }
          break;
        }
        default:
          break;
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(className, "rounded-full")}
      onClick={handleLike}
      disabled={pendingLikeTransition}
      aria-label={isLikedItem ? "Unlike" : "Like"}
      {...rest}
    >
      <Heart
        className={cn(
          "transition-transform text-inherit",
          isLikedItem && "text-primary fill-primary"
        )}
        size={20}
      />
    </Button>
  );
};

export default LikeButton;
