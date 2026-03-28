import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { marked } from "marked";
import Link from "next/link";

export async function BlogDetail({ post }: { post: Post }) {
  const content = await marked.parse(post.content);

  //return <article data-test-id={`blog-post-${post.id}`}>Detail</article>;
  return <article className="mx-auto max-w-3xl py-8 flex flex-col items-center" data-test-id={`blog-post-${post.id}`}>
        <div className="p-4 flex-1 ">
          <div className="mb-1 text-xs uppercase tracking-wide text-secondary">
            {post.date.toLocaleString("en-AU", {day: "2-digit", month: "short", year: "numeric"})} 
            &nbsp;&nbsp;{post.category}
          </div>
          <h1 className="text-primary text-3xl items-center flex flex-col">
            <Link href={`/post/${toUrlPath(post.title)}`}> {post.title} </Link>
          </h1>
          <div className="md:w-200 md:flex-shrink-0 ">
            <img
              src={`https://picsum.photos/seed/${post.id}/500/300`}
              alt={post.title}
              className="h-48 w-full object-cover md:h-full"
            />
          </div>
          <div className="mt-2 text-sm text-primary" data-test-id="content-markdown" dangerouslySetInnerHTML={{__html: await marked(post.content)}}>
          </div>
          <p className=" text-secondary mt-4 text-sm">
            {"#" + post.tags.split(",").join(" #")}
          </p>
          <div className="mt-4 border-t border-gray-200 pt-3 text-sm">
            <div className="flex items-center justify-between text-primary">
              <span>
                {post.views+1} Views
              </span>
              <span>
                {post.likes} Likes
              </span>
            </div>
          </div>
        </div>
      </article>
}
