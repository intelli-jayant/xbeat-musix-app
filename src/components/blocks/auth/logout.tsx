"use client";
import { handleLogout } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { LoaderCircle, LogOutIcon } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

const LogOut = () => {
  return (
    <form action={handleLogout}>
      <LogOutButton />
    </form>
  );
};
const LogOutButton = () => {
  const { pending } = useFormStatus();
  return (
    <>
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="rounded-sm justify-start h-fit w-full py-1.5 px-2 gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
      >
        {pending ? <LoaderCircle className="animate-spin" /> : <LogOutIcon />}
        Log Out
      </Button>
    </>
  );
};
export default LogOut;
