import AudioDetailsSidebar from "@/components/blocks/audio-details-sidebar";
import Header from "@/components/blocks/header";
// import Player from "@/components/blocks/player";
import Sidebar from "@/components/blocks/sidebar";
import MobileNavigation from "@/components/mobile-nav";
import { getUserPlaylists } from "@/db/queries";
import { UserPlaylist } from "@/db/schema";
import { getUser } from "@/lib/auth";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  let userPlaylists: UserPlaylist[] | undefined;
  if (!!user && !!user.id) {
    userPlaylists = await getUserPlaylists(user.id);
  }
  return (
    <main className="h-[100dvh] flex flex-col">
      <Header user={user} />
      <div className="flex">
        <section className="grid grid-cols-12 flex-1 overflow-hidden lg:p-3 p-0 gap-3 transition-all">
          <Sidebar user={user} userPlaylists={userPlaylists} />
          <main className="col-span-12 lg:col-span-10 dark:bg-neutral-900 lg:rounded-md rounded-none p-3 h-[calc(100dvh-112px)] lg:h-[calc(100dvh-152px)] overflow-auto pb-36 lg:pb-3">
            {children}
          </main>
        </section>
        <AudioDetailsSidebar />
      </div>
      {/* <Player user={user} userPlaylists={userPlaylists} /> */}
      <MobileNavigation user={user} />
    </main>
  );
}
