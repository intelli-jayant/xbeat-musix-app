"use client";
import { useMediaQuery } from "usehooks-ts";
import AudioPlayer from "./audio-player";
import { memo, useEffect, useState } from "react";
import { PlayerProvider } from "./player-context";
import type { User } from "next-auth";
import { UserPlaylist } from "@/db/schema";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import MobilePlayerDrawer from "./mobile-player-drawer";

const Player = memo(
  ({
    user,
    userPlaylists,
  }: {
    user?: User;
    userPlaylists?: UserPlaylist[];
  }) => {
    const isLargeScreen = useMediaQuery("(min-width: 1024px)");
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
      setHydrated(true);
    }, []);
    if (!hydrated) return null;
    return (
      <PlayerProvider>
        {isLargeScreen ? (
          <AudioPlayer user={user} userPlaylists={userPlaylists} />
        ) : (
          <Drawer>
            <DrawerTrigger asChild>
              <AudioPlayer />
            </DrawerTrigger>
            <DrawerContent aria-describedby="mobile player drawer">
              <MobilePlayerDrawer user={user} userPlaylists={userPlaylists} />
            </DrawerContent>
          </Drawer>
        )}
      </PlayerProvider>
    );
  }
);
Player.displayName = "Player";
export default Player;
