import ListCard from "@/components/blocks/horizontal-list/list-card";
// import { getTopArtists } from "@/lib/music-api-instance";
import { Lang } from "@/types";
import topArtist from "../../../static/topArtist.json";

type TopArtistsPageProps = {
  searchParams: Promise<{ page?: number; lang?: Lang }>;
};
export default async function TopArtistsPage(props: TopArtistsPageProps) {
  // const searchParams = await props.searchParams;
  // const { page, lang } = searchParams;
  // const topArtists = await getTopArtists(page, 50, lang);
  const topArtists = topArtist.data;
  return (
    <section className="mb-4">
      <header className="mb-2">
        <h2 className="font-heading text-xl">Top Artists</h2>
      </header>
      <div className="flex w-full flex-wrap">
        {topArtists.map(({ id, name, url, follower_count, image }) => (
          <ListCard
            key={id}
            name={name}
            url={url}
            subtitle={`${follower_count.toLocaleString("en-US")} Fans`}
            type="artist"
            image={image}
          />
        ))}
      </div>
    </section>
  );
}
