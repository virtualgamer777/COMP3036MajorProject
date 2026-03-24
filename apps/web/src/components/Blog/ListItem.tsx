import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import Link from "next/link";

export function BlogListItem({ post }: { post: Post }) {
  return (
    <article className="flex flex-col md:flex-row">
              {/* Image side */}
              <Link href={`/post/${toUrlPath(post.title)}`} className="block focus:outline-none outline-none">
                <div className="md:w-56 md:flex-shrink-0">
                  <img
                    src={`https://picsum.photos/seed/${post.id}/500/300`}
                    alt={post.title}
                    className="h-48 w-full object-cover md:h-full"
                  />
                </div>
              </Link>

              {/* Info side */}
              <div className="p-4 flex-1 ">
                <div className="mb-1 text-xs uppercase tracking-wide">
                  {post.date.toLocaleString("en-AU", {day: "2-digit", month: "short", year: "numeric"})} 
                  &nbsp;&nbsp;{post.category}
                </div>
                <a href={`/post/${toUrlPath(post.title)}`} className="block">
                  {post.title}
                </a>
                <p className="mt-2 text-sm text-secondary">
                  {post.description}
                </p>
                <p className=" text-secondary mt-4 text-sm">
                  {"#" + post.tags.split(",").join(" #")}
                </p>
                <div className="mt-4 border-t border-gray-200 pt-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>
                      {(
                        post as Post & { views?: number }
                      ).views ?? 0} views
                    </span>
                    <span>
                      {(
                        post as Post & { likes?: number }
                      ).likes ?? 0} Likes
                    </span>
                  </div>
                </div>
              </div>
            </article>
  );
}
