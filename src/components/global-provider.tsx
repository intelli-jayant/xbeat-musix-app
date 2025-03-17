"use client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React from "react";
import { TooltipProvider } from "./ui/tooltip";
import { Toaster } from "./ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { type ThemeProviderProps } from "next-themes";

const NextThemesProvider = dynamic(
  () => import("next-themes").then((e) => e.ThemeProvider),
  {
    ssr: false,
  }
);
type GlobalProviderProps = {
  theme?: ThemeProviderProps;
  children: React.ReactNode;
};

const queryClient = new QueryClient();
const GlobalProvider = ({ children, theme }: GlobalProviderProps) => {
  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          {...theme}
        >
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster position="top-center" />
        </NextThemesProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  );
};

export default GlobalProvider;
