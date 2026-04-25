import { env } from "@repo/env/admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";

export async function POST() {
	const cookieStore = await cookies();
	const currentRefreshToken = cookieStore.get("refresh_token")?.value;

	if (!currentRefreshToken) {
		return NextResponse.json({ error: "Missing refresh token" }, { status: 401 });
	}

	try {
		jwtVerify(currentRefreshToken, env.JWT_SECRET);
	} catch {
		return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
	}

	const newAccessToken = jwtSign({ authenticated: true, type: "access" }, env.JWT_SECRET, { expiresIn: "15m" });

	const newRefreshToken = jwtSign({ type: "refresh", sid: crypto.randomUUID() }, env.JWT_SECRET, { expiresIn: "7d" });

	cookieStore.set("auth_token", newAccessToken, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 60 * 15
	});

	cookieStore.set("refresh_token", newRefreshToken, {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/api/auth/refresh",
		maxAge: 60 * 60 * 24 * 7
	});

	return NextResponse.json({ ok: true });
}