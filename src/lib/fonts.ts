import { JetBrains_Mono, Ubuntu } from "next/font/google";
import localFont from "next/font/local";
export const fontSans = Ubuntu({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400"],
});
export const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});
export const fontHeading = localFont({
  src: "../../public/fonts/CalSans-SemiBold.woff",
  variable: "--font-heading",
});
