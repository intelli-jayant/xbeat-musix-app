"use server";

import { signIn, signOut } from "@/lib/auth";

export const signInWithGithub = async () => {
  await signIn("github");
};
export const signInWithGoogle = async () => {
  await signIn("google");
};

export const handleLogout = async () => {
  await signOut();
};
