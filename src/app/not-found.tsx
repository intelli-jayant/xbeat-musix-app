"use client";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  const errorMessages = [
    "Oops! Our DJ just scratched the wrong record.",
    "404 BPM: Beats Per Missing",
    "This track is experiencing technical difficulties.",
    "Our playlist just hit a sour note.",
    "Looks like we're experiencing some audio interference.",
  ];

  const randomMessage =
    errorMessages[Math.floor(Math.random() * errorMessages.length)];

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh]  text-white p-4 overflow-hidden">
      <div className="text-center space-y-8 relative">
        <div className=" flex items-center justify-center">
          <span className="text-6xl font-bold font-mono">404</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          {randomMessage}
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center bg-white text-black hover:bg-gray-200 font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to the Playlist
          </Button>
        </div>
      </div>
      <div className="mt-12 text-sm text-gray-500 animate-bounce">
        Pro tip: Try turning it off and on again. Works every time, 60% of the
        time!
      </div>
    </div>
  );
}
