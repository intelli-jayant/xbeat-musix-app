import DetailsHeader from "@/components/blocks/details-header/details-header";
import SongList from "@/components/blocks/song-list/song-list";
import { getMixDetails } from "@/lib/music-api-instance";

type MixDetailsPageProps = {
  params: Promise<{
    name: string;
    token: string;
  }>;
};
export default async function MixDetailsPage(props: MixDetailsPageProps) {
  const params = await props.params;

  const {
    token
  } = params;

  const mix = await getMixDetails(token);

  return (
    <section className="mb-4 space-y-4">
      <DetailsHeader item={mix} />
      <SongList items={mix.songs!} />
    </section>
  );
}
