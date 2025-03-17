import ListCard from "@/components/blocks/horizontal-list/list-card";
import { getHomeData } from "@/lib/music-api-instance";
import { cn } from "@/lib/utils";
export default async function Home() {
  const homePageData = await getHomeData();

  return Object.entries(homePageData).map(([key, section]) => {
    if ("random_songs_listid" in section || key === "discover") return null;
    return (
      <section key={key} className="mb-4">
        <header className="mb-2">
          <h2 className="font-heading text-xl ">{section.title}</h2>
          {section.subtitle && (
            <p className="text-muted-foreground font-medium text-sm">
              {section.subtitle}
            </p>
          )}
        </header>
        <div className={cn("flex flex-wrap")}>
          {section.data.map(
            ({ name, id, image, url, type, explicit, subtitle }) => (
              <ListCard
                key={id}
                name={name}
                image={image}
                url={url}
                type={type}
                explicit={explicit}
                subtitle={subtitle}
              />
            )
          )}
        </div>
      </section>
    );
  });
}
