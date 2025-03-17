import ListCard from "@/components/blocks/horizontal-list/list-card";
// import { getCharts } from "@/lib/music-api-instance";
import topCharts from "../../../static/topChart.json";

export default async function TopChartsPage() {
  // const charts = await getCharts();
  const charts = topCharts.data;
  console.log(charts);
  

  return (
    <section className="mb-4">
      <header className="mb-2">
        <h2 className="font-heading text-xl">Top Music Charts</h2>
      </header>

      <div className="flex w-full flex-wrap">
        {charts.map(({ id, name, url, subtitle, type, image, explicit }) => (
          <ListCard
            key={id}
            name={name}
            url={url}
            subtitle={subtitle}
            type={type}
            image={image}
            explicit={explicit}
            aspect="video"
          />
        ))}
      </div>
    </section>
  );
}
