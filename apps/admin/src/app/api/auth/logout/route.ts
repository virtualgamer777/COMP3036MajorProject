//import { env } from "@repo/env/admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return NextResponse.redirect(new URL("/", req.url));

}
