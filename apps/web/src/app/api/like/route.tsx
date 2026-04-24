import { NextRequest, NextResponse } from "next/server";
import { client } from "@repo/db/client";
import { addLike, dislike, getLikes, getPosts, Likes } from "@repo/db/data";

export async function POST(request: NextRequest) {
  const { postId } = (await request.json()) as { postId?: number };

  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }

  //get ip address
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "";

	//error if no ip
  if (!ip) {
    return NextResponse.json({ error: "IP not available" }, { status: 400 });
  }

  const posts = await getPosts();
  const post = posts.find((post) => post.id == postId);
  if (!post) {
    return NextResponse.json({ error: "Post not available" }, { status: 400 });
  }
  const existingLikes: Likes[] = await getLikes(post!);
  
  const alreadyLiked: Boolean = existingLikes.find((like) => like.userIP == ip) != undefined
  if(!alreadyLiked)
  {
	addLike(ip, postId)
  }
  else
  {
	dislike(ip, postId);
  }

  return NextResponse.json({}, {status: 200});
  

//   await client.db.like.upsert({
//     where: {
//       postId_userIP: {
//         postId,
//         userIP: ip,
//       },
//     },
//     update: {},
//     create: {
//       postId,
//       userIP: ip,
//     },
//   });

  //const likes = await client.db.like.count({ where: { postId } });
  //return NextResponse.json({ likes }, { status: 200 });
}