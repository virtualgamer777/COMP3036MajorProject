import { env } from "@repo/env/admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";


export async function POST(req: Request) {

  const formData = await req.formData();
  const password = String(formData.get("Password") ?? "");

  if (password !== env.PASSWORD) {
    return NextResponse.redirect(new URL("/?error=Wrong Password", req.url));
  }

  const accessToken = jwtSign({ authenticated: true, type: "access" },env.JWT_SECRET,{ expiresIn: "15m" });



const refreshToken = jwtSign({ type: "refresh", sid: crypto.randomUUID() },env.JWT_SECRET,{ expiresIn: "7d" });

  const cookieStore = await cookies();
  cookieStore.set("auth_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15
  });
  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/auth/refresh",
    maxAge: 60 * 60 * 24 * 7
  });

  return NextResponse.redirect(new URL("/", req.url));
}

export async function DELETE(req: Request) {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return NextResponse.redirect(new URL("/", req.url));

}
