"use client";

import type { PropsWithChildren } from "react";

export function AppLayout({
  children,
}: PropsWithChildren<{ query?: string }>) {
  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/";
  }

  return (
    <div className="py-6 mr-36">
      <div className="absolute right-4 top-4 z-10">
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
        >
          Logout
        </button>
      </div>

      <main>{children}</main>
    </div>
  );
}