import { cn } from "@/lib/utils";
import Image from "next/image";

const ImageCollage = ({ src }: { src: string[] }) => {
  return (
    <div
      className={cn(
        "h-full",
        src.length === 4 && "grid grid-cols-2 grid-rows-2 gap-0.5"
      )}
    >
      {src.map((image, idx) => {
        return (
          <div key={idx} className="relative h-full overflow-hidden rounded-md">
            <Image
              src={image}
              fill
              alt="Cover Image"
              className={cn(
                src.length === 1 &&
                  src[0].includes("placeholder") &&
                  "dark:invert"
              )}
            />
          </div>
        );
      })}
    </div>
  );
};
export default ImageCollage;
