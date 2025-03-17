import ImageWithFallback from "@/components/image-with-fallback";
import { useCurrentAudioIndex, useQueue } from "@/hooks/atom-hooks";
import { type QueueItem as QueueItemType } from "@/types";

export const QueueTab = () => {
  const queue = useQueue()[0];
  const [currentAudioIndex, setCurrentAudioIndex] = useCurrentAudioIndex();
  return (
    <>
      {[...queue].slice(currentAudioIndex + 1).length > 0 ? (
        <div className="w-full space-y-2 p-3">
          <h4 className="font-heading">Now Playing</h4>
          <QueueItem data={queue[currentAudioIndex]} />
          <h4 className="font-heading">Upcoming</h4>
          <div className="space-y-3">
            {[...queue].slice(currentAudioIndex + 1).map((item, idx) => {
              const originalIndex = idx + currentAudioIndex + 1;
              return (
                <QueueItem
                  data={item}
                  key={item.id}
                  handleClick={() => setCurrentAudioIndex(originalIndex)}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-center text-muted-foreground my-3">
          Play songs to see items here
        </p>
      )}
    </>
  );
};

const QueueItem = ({
  data,
  handleClick = () => {},
}: {
  data: QueueItemType;
  handleClick?: () => void;
}) => {
  return (
    <div
      className="flex gap-3 items-center cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-square w-12 h-12 shrink-0 overflow-hidden rounded-md">
        <ImageWithFallback
          image={data.image}
          imageQuality="medium"
          fill
          alt={data.name}
          type={data.type}
        />
      </div>
      <div className="w-[calc(100%-48px)]">
        <p className="text-sm text-left line-clamp-1">{data.name}</p>
        <p className="text-xs text-muted-foreground line-clamp-1 text-left">
          {data.subtitle}
        </p>
      </div>
    </div>
  );
};
