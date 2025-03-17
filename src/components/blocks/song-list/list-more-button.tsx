"use client";
import ImageWithFallback from "@/components/image-with-fallback";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  addSongsToPlaylist,
  addToLibrary,
  removeFromLibrary,
  removeSongFromPlaylist,
} from "@/db/queries";
import { Library, UserPlaylist } from "@/db/schema";
import { useQueue } from "@/hooks/atom-hooks";
import { Episode, Song, QueueItem } from "@/types";

import {
  Download,
  Heart,
  Info,
  ListEnd,
  ListMusic,
  ListX,
  type LucideIcon,
  MoreVertical,
} from "lucide-react";
import { User } from "next-auth";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import AddToPlaylistDialogDrawer from "../playlist/add-to-playlist-dialog-drawer";
import { getHref, showLoginError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";

type ListMoreButtonProps = {
  user: User | undefined;
  item: Song | Episode | QueueItem;
  library?: Library;
  playlists?: UserPlaylist[];
  className?: string;
};
type MenuItem = {
  label: string;
  onClick?: () => void;
  hide?: boolean;
  icon?: LucideIcon;
  subMenuItems?: MenuItem[];
  id?: string;
};
const ListMoreButton = ({
  user,
  playlists,
  item,
  library,
}: ListMoreButtonProps) => {
  const [queue, setQueue] = useQueue();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { playlistId } = useParams();
  const currentPlaylistSongs =
    (!!playlistId && playlists?.find((p) => p.id === playlistId)?.songs) || [];
  const [isOpenAddToPlaylistDiaglogDrawer, setOpenAddToPlaylistDiaglogDrawer] =
    useState(false);
  const { id, name, subtitle, type, image } = item;
  const itemIndexInQueue = useMemo(
    () => queue.findIndex((i) => i.id === id),
    [queue, id]
  );

  const isAlreadyInLibrary = useMemo(
    () => !!library?.songs?.includes(id),
    [library, id]
  );

  const addToPlaylist = (id: string, name: string) => {
    toast.promise(addSongsToPlaylist(id, [item.id]), {
      loading: "Adding to playlist...",
      success: `"${item.name}" added to ${name} playlist`,
      error: (e) => e.message,
      finally: () => {
        setOpen(false);
        setOpenAddToPlaylistDiaglogDrawer(false);
      },
    });
  };
  const addToQueue = () => {
    if (type === "episode") return;
    if (itemIndexInQueue !== -1) {
      setQueue((prev) => prev.filter((i) => i.id !== id));
      toast.success(`"${name}" removed from queue`);
    } else {
      let toQueue: QueueItem;
      if ("explicit" in item) {
        const {
          id,
          name,
          subtitle,
          type,
          url,
          image,
          artist_map: { featured_artists: artists },
          download_url,
          duration,
        } = item;

        toQueue = {
          id,
          name,
          subtitle,
          type,
          url,
          image,
          artists,
          download_url,
          duration,
        } satisfies QueueItem;
      } else {
        toQueue = item;
      }

      setQueue((prev) => [...prev, toQueue]);
      toast.success(`"${name}" added to queue`);
    }
    setOpen(false);
  };
  const handleAddToPlaylist = () => {
    if (!!user) {
      setOpenAddToPlaylistDiaglogDrawer(true);
    } else {
      showLoginError();
    }
  };

  const downloadAudio = async () => {
    let response;
    if (typeof item.download_url === "string") {
      response = await fetch(item.download_url);
    } else {
      response = await fetch(
        item?.download_url[item.download_url?.length - 1].link
      );
    }
    if (!response.body) throw new Error("Download failed");

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const blob = new Blob(chunks);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name + ".mp3";
    function handleDownload() {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener("click", handleDownload, false);
      }, 150);
    }
    a.addEventListener("click", handleDownload, false);
    a.click();
  };

  const handleAddToLibrary = () => {
    if (!!user && !!user.id) {
      if (type === "song") {
        if (library?.songs?.includes(id)) {
          toast.promise(removeFromLibrary(user.id!, id, type), {
            loading: "Removing from library",
            success: `"${name}" removed from library`,
            error: (e) => e.message,
          });
        } else {
          toast.promise(addToLibrary(user.id!, id, type), {
            loading: "Adding to library",
            success: `"${name}" added to library`,
            error: (e) => e.message,
          });
        }
      }
    } else {
      showLoginError();
    }
  };
  const menuItems: MenuItem[] = [
    {
      label: !isAlreadyInLibrary ? "Add to Library" : "Remove from Library",
      icon: Heart,
      onClick: handleAddToLibrary,
      hide: !user,
    },
    {
      label: itemIndexInQueue === -1 ? "Add to Queue" : "Remove from Queue",
      onClick: addToQueue,
      icon: ListEnd,
    },
    {
      label: !currentPlaylistSongs.includes(item.id)
        ? "Add to Playlist"
        : "Add to another Playlist",
      icon: ListMusic,
      onClick: handleAddToPlaylist,
      hide: !user,
    },
    {
      label: "Remove from this playlist",
      icon: ListX,
      onClick: () => {
        toast.promise(removeSongFromPlaylist(playlistId as string, item.id), {
          success: `${item.name} removed from this playlist`,
          error: (e) => e.message,
        });
      },
      hide: !currentPlaylistSongs.includes(item.id) || !user,
    },
    {
      label: "Song Details",
      icon: Info,
      onClick: () => {
        router.push(getHref(item.url, item.type));
        setOpen(false);
      },
    },
    {
      label: "Download",
      icon: Download,
      onClick: () =>
        toast.promise(downloadAudio(), {
          loading: `Downloading "${item.name}"`,
          success: `Downloaded "${item.name}"`,
          error: (e) => e.message,
          finally() {
            setOpen(false);
          },
        }),
    },
  ];

  return (
    <>
      <div className="lg:block hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="hover:text-primary" size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {menuItems.slice(0, 3).map(
              ({ label, onClick, icon: Icon, hide }, idx) =>
                !hide && (
                  <DropdownMenuItem
                    key={`list-more-item-${idx}`}
                    onClick={onClick}
                  >
                    {Icon && <Icon className="size-4" />}
                    {label}
                  </DropdownMenuItem>
                )
            )}
            <DropdownMenuSeparator />
            {menuItems.slice(3).map(
              ({ label, onClick, icon: Icon, hide }, idx) =>
                !hide && (
                  <DropdownMenuItem
                    key={`list-more-item-${idx}`}
                    onClick={onClick}
                  >
                    {Icon && <Icon className="size-4" />}
                    {label}
                  </DropdownMenuItem>
                )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="lg:hidden">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="hover:text-primary" size={20} />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left flex items-center gap-4 border-b">
              <ImageWithFallback
                image={image}
                imageQuality="medium"
                alt={name}
                type={type}
                width={48}
                height={48}
                className="rounded-md"
              />
              <div>
                <DrawerTitle className="mb-1">{name}</DrawerTitle>
                <DrawerDescription>{subtitle}</DrawerDescription>
              </div>
            </DrawerHeader>
            {menuItems.slice(0, 3).map(
              ({ label, icon: Icon, onClick, hide }, idx) =>
                !hide && (
                  <Button
                    key={`list-more-item-mobile-${idx}`}
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={onClick}
                  >
                    {Icon && <Icon className="size-4" />}
                    {label}
                  </Button>
                )
            )}
            <Separator />
            {menuItems.slice(3).map(
              ({ label, icon: Icon, onClick, hide }, idx) =>
                !hide && (
                  <Button
                    key={`list-more-item-mobile-${idx}`}
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={onClick}
                  >
                    {Icon && <Icon className="size-4" />}
                    {label}
                  </Button>
                )
            )}

            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      {!!user && (
        <AddToPlaylistDialogDrawer
          open={isOpenAddToPlaylistDiaglogDrawer}
          setOpen={setOpenAddToPlaylistDiaglogDrawer}
          user={user}
          playlists={playlists}
          addToPlaylist={addToPlaylist}
        />
      )}
    </>
  );
};

export default ListMoreButton;
