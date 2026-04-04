import { env } from "@repo/env/admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const password = String(formData.get("password") ?? "");

  if (password !== env.PASSWORD) {
    return NextResponse.redirect(new URL("/?error=Wrong\ Password", req.url));
  }

  const cookieStore = await cookies();
  cookieStore.set("auth_token", "logged-in", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.redirect(new URL("/", req.url));
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return NextResponse.json({ ok: true });
}