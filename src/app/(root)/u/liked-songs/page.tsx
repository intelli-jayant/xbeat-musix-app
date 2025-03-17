import { getUser } from "@/lib/auth";
import { LikedSongs } from "./_components/liked-songs";
export default async function LikedSongsPage() {
  const user = await getUser();
  return <LikedSongs user={user} />;
}
