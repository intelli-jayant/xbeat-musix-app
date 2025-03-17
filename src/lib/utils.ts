import { ImageQuality, Quality, StreamQuality, Type } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
type Color = { r: number; g: number; b: number };
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const imageQualityMapWithIndex: { [key in ImageQuality]: number } = {
  low: 0,
  medium: 1,
  high: 2,
};
export const getImageSizes = (imageData: Quality, quality: ImageQuality) => {
  if (typeof imageData === "string") return "";
  return (
    imageData[imageQualityMapWithIndex[quality]].quality.split("x")[0] + "px"
  );
};

export const getImageSource = (imageData: Quality, quality: ImageQuality) => {
  if (typeof imageData === "string") return imageData;
  return imageData[imageQualityMapWithIndex[quality]].link;
};
export const trimStringAddEllipsis = (
  str: string,
  maxLength: number = 38,
  ellipses = true
) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + (ellipses ? "..." : "");
  } else {
    return str;
  }
};

export function getHref(url: string, type: Type) {
  // const re = /https:\/\/www.jiosaavn.com\/(s\/)?\w*/;
  // return `/${url.replace(re, type)}`;
  const regex = /\/([^/]+)\/([^/]+)$/;
  const match = url.match(regex);

  if (match) {
    // Decode URL-encoded characters for better readability
    const name = decodeURIComponent(match[1]);
    const token = match[2];
    return `/${type}/${name}/${token}`;
  }
  return "";
}

export function formatDuration(seconds: number, format: "hh:mm:ss" | "mm:ss") {
  const date = new Date(seconds * 1000);

  return format === "hh:mm:ss"
    ? date.toISOString().slice(11, 19)
    : date.toISOString().slice(14, 19);
}

export function getDownloadLink(url: Quality, quality: StreamQuality) {
  if (typeof url === "string") {
    return url;
  }
  switch (quality) {
    case "poor":
      return url[0].link;
    case "low":
      return url[1].link;
    case "medium":
      return url[2].link;
    case "high":
      return url[3].link;
    default:
      return url[4].link;
  }
}

export function generateSizesString(imageData: Quality) {
  const breakpoints = {
    xs: 480,
    sm: 640,
    md: 768,
  };

  let sizesString = "";
  if (typeof imageData === "string") return "";
  imageData.forEach((image) => {
    const width = image.quality.split("x")[0];
    const sizeBreakpoints = Object.keys(
      breakpoints
    ) as (keyof typeof breakpoints)[];

    sizeBreakpoints.forEach((bp, index) => {
      const nextBp = sizeBreakpoints[index + 1];
      const maxWidth = breakpoints[nextBp] ? breakpoints[nextBp] - 1 : null;
      if (maxWidth) {
        sizesString += `(max-width: ${maxWidth}px) ${width}px, `;
      }
    });
  });
  sizesString += "500px";
  return sizesString;
}

export function getInitials(name: string) {
  if (!name) return "";

  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export const showLoginError = () => {
  toast.info("Unable to perform action", {
    description: "You need to be logged in to perform this action",
  });
};

export const toRgbArray = (imageData: ImageData) => {
  const values = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    values.push({
      r: imageData.data[i],
      g: imageData.data[i + 1],
      b: imageData.data[i + 2],
    });
  }
  return values;
};
const findBiggestColorRange = (rgbValues: Color[]) => {
  let rMin = Number.MAX_VALUE;
  let gMin = Number.MAX_VALUE;
  let bMin = Number.MAX_VALUE;

  let rMax = Number.MIN_VALUE;
  let gMax = Number.MIN_VALUE;
  let bMax = Number.MIN_VALUE;

  rgbValues.forEach((pixel) => {
    rMin = Math.min(rMin, pixel.r);
    gMin = Math.min(gMin, pixel.g);
    bMin = Math.min(bMin, pixel.b);

    rMax = Math.max(rMax, pixel.r);
    gMax = Math.max(gMax, pixel.g);
    bMax = Math.max(bMax, pixel.b);
  });

  const rRange = rMax - rMin;
  const gRange = gMax - gMin;
  const bRange = bMax - bMin;

  const biggestRange = Math.max(rRange, gRange, bRange);
  if (biggestRange === rRange) {
    return "r";
  } else if (biggestRange === gRange) {
    return "g";
  } else {
    return "b";
  }
};
export const quantization = (rgbValues: Color[], depth: number): Color[] => {
  const MAX_DEPTH = 4;
  if (depth === MAX_DEPTH || rgbValues.length === 0) {
    const color = rgbValues.reduce(
      (prev, curr) => {
        prev.r += curr.r;
        prev.g += curr.g;
        prev.b += curr.b;

        return prev;
      },
      {
        r: 0,
        g: 0,
        b: 0,
      }
    );
    if (rgbValues.length > 0) {
      color.r = Math.round(color.r / rgbValues.length);
      color.g = Math.round(color.g / rgbValues.length);
      color.b = Math.round(color.b / rgbValues.length);
    }
    return [color];
  }

  const componentToSortBy = findBiggestColorRange(rgbValues);
  rgbValues.sort((p1, p2) => {
    return p1[componentToSortBy] - p2[componentToSortBy];
  });

  const mid = Math.floor(rgbValues.length / 2);
  console.log({ mid });
  return [
    ...quantization(rgbValues.slice(0, mid), depth + 1),
    ...quantization(rgbValues.slice(mid + 1), depth + 1),
  ];
};
export const rgbToHex = (color: Color) => {
  const { r, g, b } = color;
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export function getRandomNumberInRange(min: number, max: number) {
  // Ensure the min and max are numbers and the min is less than or equal to the max
  if (typeof min !== "number" || typeof max !== "number" || min > max) {
    return 0;
  }

  // Generate the random number within the range
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
