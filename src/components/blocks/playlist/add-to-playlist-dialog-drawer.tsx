import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { UserPlaylist } from "@/db/schema";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import type { User } from "next-auth";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewPlaylistDialogDrawer } from "./new-playlist-dialog-drawer";
import { useId } from "react";
import { ListMusic, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type AddToPlaylistDialogDrawerProps = {
  user: User | undefined;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  playlists?: UserPlaylist[];
  addToPlaylist: (id: string, name: string) => void;
};
const AddToPlaylistDialogDrawer = ({
  open,
  setOpen,
  user,
  playlists,
  addToPlaylist,
}: AddToPlaylistDialogDrawerProps) => {
  const uniqueId = useId();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  if (isLargeScreen) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add to playlist</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-56">
            <div className="pr-3">
              {playlists &&
                playlists.length > 0 &&
                playlists.map(({ name, id, songs }) => {
                  return (
                    <Button
                      variant="ghost"
                      className="justify-start items-center gap-2 text-start h-14 w-full"
                      key={id}
                      title={name}
                      onClick={() => addToPlaylist(id, name)}
                    >
                      <ListMusic className="size-6 shrink-0" />
                      <div className="flex items-center gap-3 flex-1 justify-between">
                        <p className="text-sm truncate w-[224px]">{name}</p>
                        <span className="text-start text-xs text-muted-foreground">
                          {songs.length ? songs.length : "No"}&nbsp;songs
                        </span>
                      </div>
                    </Button>
                  );
                })}
            </div>
          </ScrollArea>
          <DialogFooter>
            <NewPlaylistDialogDrawer user={user}>
              <Button className="w-full gap-2">
                <Plus className="size-4" />
                Create new playlist
              </Button>
            </NewPlaylistDialogDrawer>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      key={uniqueId}
      open={open}
      onOpenChange={setOpen}
      nested={true}
      fixed
    >
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add to playlist</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-[64vh]">
          <div className="flex flex-col px-3 gap-y-2">
            {playlists &&
              playlists.length > 0 &&
              playlists.map(({ name, id, songs }) => {
                return (
                  <Button
                    variant="ghost"
                    className="justify-start gap-2 text-start h-14"
                    key={id}
                    onClick={() => addToPlaylist(id, name)}
                  >
                    <ListMusic className="size-6" />
                    <div className="flex flex-col">
                      <p className="text-start font-medium truncate">{name}</p>
                      <span className="text-start text-xs text-muted-foreground">
                        {songs.length ? songs.length : "No"}&nbsp;songs
                      </span>
                    </div>
                  </Button>
                );
              })}
          </div>
        </ScrollArea>

        <DrawerFooter className="pt-2">
          <NewPlaylistDialogDrawer user={user}>
            <Button>Create new playlist</Button>
          </NewPlaylistDialogDrawer>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
export default AddToPlaylistDialogDrawer;
