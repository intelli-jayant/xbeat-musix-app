"use client";
import { cn, getImageSizes, getImageSource } from "@/lib/utils";
import type { ImageQuality, Quality, Type } from "@/types";
import type { ImageProps } from "next/image";
import Image from "next/image";
import { SyntheticEvent, useEffect, useState } from "react";

type ImageWithFallbackProps = Omit<ImageProps, "src"> &
  Partial<Pick<ImageProps, "src">> & {
    fallback?: string;
    type: Type;
    image?: Quality;
    imageQuality?: ImageQuality;
  };
const ImageWithFallback = ({
  type,
  fallback = `/images/placeholder/${type}.jpg`,
  alt,
  src,
  className,
  image = "",
  imageQuality = "high",
  ...rest
}: ImageWithFallbackProps) => {
  const [error, setError] = useState<SyntheticEvent<
    HTMLImageElement,
    Event
  > | null>(null);
  const imageSrc = src ?? getImageSource(image, imageQuality);
  useEffect(() => {
    setError(null);
  }, [imageSrc]);
  return (
    <Image
      src={error ? fallback : imageSrc || fallback}
      alt={alt}
      onError={setError}
      className={cn(className)}
      {...{
        ...rest,
        ...(!!rest.fill &&
          !rest.sizes && { sizes: getImageSizes(image, imageQuality) }),
      }}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;
