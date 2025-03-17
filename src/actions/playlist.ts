"use server";

import { db } from "@/db";
import { userPlaylists } from "@/db/schema";
import { newPlaylistSchema } from "@/lib/validations";
import { unstable_expireTag as expireTag } from "next/cache";
import { z } from "zod";

export const createNewPlaylist = async (
  data: z.infer<typeof newPlaylistSchema> & { userId: string }
) => {
  const [playlist] = await db.insert(userPlaylists).values(data).returning();
  if (!playlist) {
    throw new Error("Failed to create playlist");
  }
  expireTag("user_playlists");
  return playlist;
};
