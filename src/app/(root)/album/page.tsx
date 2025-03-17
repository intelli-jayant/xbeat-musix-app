import { getTopAlbums } from "@/lib/music-api-instance";
import { Lang } from "@/types";
import TopAlbums from "./_components/top-albums";
import topAlbums from "../../../static/topAlbum.json";

type TopAlbumsPageProps = {
  searchParams: Promise<{ page?: number; lang?: Lang }>;
};
export default async function TopAlbumsPage(props: TopAlbumsPageProps) {
  const searchParams = await props.searchParams;
  const { lang, page = 1 } = searchParams;
  // const initialTopAlbumsData = await getTopAlbums(page, 50, lang);
  const initialTopAlbumsData = topAlbums.data.data;
  console.log("init album data: ", initialTopAlbumsData);
  
  return (
    <section className="mb-4">
      <header className="mb-2">
        <h2 className="font-heading text-xl">New Releases</h2>
      </header>

      <TopAlbums initialAlbums={initialTopAlbumsData} lang={lang} />
    </section>
  );
}
