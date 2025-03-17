import React from "react";
import LibraryNavbar from "./_components/library-navbar";

export default async function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <header className="flex justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-heading text-2xl lg:text-3xl">Your Library</h3>
        </div>
      </header>
      <LibraryNavbar />
      <div className="grid grid-cols-library-auto-fill gap-2">{children}</div>
    </section>
  );
}
