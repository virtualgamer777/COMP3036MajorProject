"use client";

import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import Link from "next/link";

export function AdminListItem({ post }: { post: Post }) {
  return (
    <article data-test-id={`blog-post-${post.id}`} className="flex flex-col md:flex-row">
      {/* Image side */}
      <Link href={`/post/${post.urlId}`} className="block focus:outline-none outline-none">
        <div className="md:w-56 md:flex-shrink-0">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="h-48 w-full object-cover md:h-full"
          />
        </div>
      </Link>

      {/* Info side */}
      <div className="flex-1 p-4 text-secondary">
        <div className="mb-1 text-xs uppercase tracking-wide">
          Posted on {post.date.toLocaleString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          &nbsp;&nbsp;{post.category}
        </div>

        <Link href={`/post/${post.urlId}`} className="block">
          {post.title}
        </Link>

        {/* <p className="mt-2 text-sm text-secondary">{post.description}</p> */}

        <p className="mt-4 text-sm text-secondary">
          {"#" + post.tags.split(",").join(", #")}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 text-sm">
          <button
            type="button"
            onClick={() => alert(`Post ${post.id} is ${post.active ? "Active" : "Inactive"}`)}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium hover:bg-gray-100"
          >
            {post.active ? "Active" : "Inactive"}
          </button>
        </div>
      </div>
    </article>
  );
}
