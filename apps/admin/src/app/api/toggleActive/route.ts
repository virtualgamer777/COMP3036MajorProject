// apps/admin/src/app/api/toggleActive/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPosts, upsertPost } from "@repo/db/data";

export async function POST(request: NextRequest) {
  const { postId } = (await request.json()) as { postId?: number };

  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }

  const posts = await getPosts();
  const post = posts.find((item) => item.id === postId);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const updatedPost = {
    ...post,
    active: !post.active,
  };

  await upsertPost(updatedPost);
  revalidatePath("/");

  return NextResponse.json({ active: updatedPost.active }, { status: 200 });
}