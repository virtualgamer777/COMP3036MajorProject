"use server"

import { getLikes, upsertPost, type Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { marked } from "marked";
import Link from "next/link";
import { headers } from "next/headers";
import LikeButton from "./LikeButton";

export async function BlogDetail({ post }: { post: Post }) {
  const headerList = await headers();
  const content = await marked.parse(post.content);
  const newPost = post;
  newPost.views += 1;
  await upsertPost(newPost);
  const likedPosts = await getLikes(newPost);

  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "";
  let liked: boolean = likedPosts.find((likedPost) => likedPost.userIP == ip)! != undefined;


  //return <article data-test-id={`blog-post-${post.id}`}>Detail</article>;
  return <article className="mx-auto max-w-3xl py-8 flex flex-col items-center" data-test-id={`blog-post-${newPost.id}`}>
        <div className="p-4 flex-1 ">
          <div className="mb-1 text-xs uppercase tracking-wide text-secondary">
            {newPost.date.toLocaleString("en-AU", {day: "2-digit", month: "short", year: "numeric"})} 
            &nbsp;&nbsp;{newPost.category}
          </div>
          <h1 className="text-primary text-3xl items-center flex flex-col">
            <Link href={`/post/${toUrlPath(newPost.title)}`}> {newPost.title} </Link>
          </h1>
          <div className="md:w-200 md:flex-shrink-0 ">
            <img
              src={newPost.imageUrl}
              alt={newPost.title}
              className="h-48 w-full object-cover md:h-full"
            />
          </div>
          <div className="mt-2 text-sm text-primary" data-test-id="content-markdown" dangerouslySetInnerHTML={{__html: await marked(newPost.content)}}>
          </div>
          <p className=" text-secondary mt-4 text-sm">
            {"#" + newPost.tags.split(",").join(" #")}
          </p>
          <div className="mt-4 border-t border-gray-200 pt-3 text-sm">
            <div className="flex items-center justify-between text-primary">
              <span>
                {newPost.views} Views
              </span>
              <LikeButton postId={post.id} initialLikes={newPost.likes} initiallyLiked={liked}/>
              {/* <span className={liked ? "text-pink-700" : "text-primary"}>
                 {newPost.likes} Likes
              </span> */}
            </div>
          </div>
        </div>
      </article>
}
