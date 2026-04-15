import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import Link from "next/link";
import { AdminListItem } from "./ListItem";

export function AdminList({ posts }: { posts: Post[] }) {
  //if there are no posts provided, display that
  if (posts.length === 0)
  {
    return <div className="mr-36 space-y-4 mt-5 text-primary ml-5 text-3xl items-center flex flex-col">0 Posts</div>
  }
  return (
    <div className="py-6 mr-36">
      <ul className="space-y-4">
        {posts
        .map((post) => (
          <li key={post.id} className="overflow-hidden rounded-lg ml-5 ">
            <AdminListItem post={post}></AdminListItem>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminList;
