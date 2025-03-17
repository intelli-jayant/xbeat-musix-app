import * as React from "react";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Image from "next/image";
import GoogleIcon from "@/components/icons/google.svg";
// import GitHubIcon from "@/components/icons/github-mark.svg";
import { signInWithGoogle } from "@/actions/auth-actions";
export function LoginDrawerDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign in to xbeats</DialogTitle>
            <DialogDescription>
              Create playlists, like songs, and personalize your xbeats
              experience.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={signInWithGoogle}
            variant="outline"
            className="w-full"
          >
            <Image
              src={GoogleIcon}
              width={16}
              height={16}
              alt="google"
              className="mr-3"
            />
            &nbsp; Login with Google
          </Button>
          {/* <Button
            onClick={signInWithGithub}
            variant="outline"
            className="w-full"
            type="submit"
          >
            <Image
              src={GitHubIcon}
              width={16}
              height={16}
              alt="github"
              className="mr-3"
            />
            Login with GitHub
          </Button> */}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Sign in to xbeats</DrawerTitle>
          <DrawerDescription>
            Create playlists, like songs, and personalize your xbeats
            experience.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 space-y-2">
          <Button
            onClick={signInWithGoogle}
            variant="outline"
            className="w-full"
          >
            <Image
              src={GoogleIcon}
              width={16}
              height={16}
              alt="google"
              className="mr-3"
            />
            &nbsp; Login with Google
          </Button>
          {/* <Button
            onClick={signInWithGithub}
            variant="outline"
            className="w-full"
            type="submit"
          >
            <Image
              src={GitHubIcon}
              width={16}
              height={16}
              alt="github"
              className="mr-3"
            />
            Login with GitHub
          </Button> */}
        </div>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
