import ListCard, { ListCardProps } from "./list-card";

type HorizonalListProps = {
  title: string;
  subtitle?: string;
  items: ({ id: string } & ListCardProps)[];
};

const HorizonalList = ({ title, subtitle, items }: HorizonalListProps) => {
  return (
    <section className="mb-4">
      <header className="mb-2">
        <h2 className="font-heading text-xl ">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground font-medium text-sm">
            {subtitle}
          </p>
        )}
      </header>
      <div className="flex flex-wrap w-full">
        {items.map(
          ({ name, id, image, url, type, explicit, subtitle }, idx) => (
            <ListCard
              key={`${id}-${idx}`}
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
};

export default HorizonalList;
