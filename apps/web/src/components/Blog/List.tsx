import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import Link from "next/link";
import { BlogListItem } from "./ListItem";

export function BlogList({ posts }: { posts: Post[] }) {
  //if there are no posts provided, display that
  if (posts.length === 0)
  {
    return <div className="py-6">0 Posts</div>
  }
  return (
    <div className="py-6 mr-36">
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="overflow-hidden rounded-lg ml-5 ">
            <BlogListItem post={post}></BlogListItem>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlogList;
