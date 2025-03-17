"use client";

import { useRouter } from "next/navigation";
import { Music, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Error({
  //   error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-background">
      <Card className="w-full max-w-md border-none">
        <CardHeader className="flex flex-row gap-3 items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            <Music className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-center">
            Oops! Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            We&apos;re having trouble playing your music. Don&apos;t worry,
            it&apos;s not you - it&apos;s us.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            Go Home
          </Button>
          <Button onClick={() => reset()}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
