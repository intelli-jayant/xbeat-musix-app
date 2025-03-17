"use client";
import React, { memo, useEffect, useRef } from "react";
import { cn, quantization, rgbToHex, toRgbArray } from "@/lib/utils";
const onImageLoad = (
  image: HTMLImageElement,
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(image, 0, 0);

  const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
  const rgbValues = toRgbArray(imageData!);
  const quantizedColors = quantization(rgbValues, 4);
  containerRef.current!.style.background = rgbToHex(quantizedColors[0]);
};
const loadImageFromUrl = (
  url: string,
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = url;

  image.onload = () => onImageLoad(image, containerRef);
};
/**
 * DominantColorBackground
 *
 * A component that wraps its children in a container with a gradient that
 * transitions from transparent to black. The background color of the container
 * is set to the dominant color of the image at the given url.
 *
 * @param {React.ReactNode} children - The content to be rendered inside the
 *   container.
 * @param {string} imageSrc - The URL of the image to be used to determine the
 *   dominant color.
 */
const DominantColorBackground = memo(
  ({
    children,
    imageSrc,
    className,
    ...rest
  }: {
    children: React.ReactNode;
    imageSrc?: string;
  } & React.HTMLAttributes<HTMLDivElement>) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (imageSrc) {
        loadImageFromUrl(imageSrc, containerRef);
      }
    }, [imageSrc, containerRef]);
    return (
      <div
        ref={containerRef}
        className={cn(className, "transition-all duration-500")}
        {...rest}
      >
        <div className={cn("bg-gradient-to-b from-transparent to-black/50")}>
          {children}
        </div>
      </div>
    );
  }
);
DominantColorBackground.displayName = "DominantColorBackground";
export default DominantColorBackground;
