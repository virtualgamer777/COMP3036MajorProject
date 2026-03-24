import type { Post } from "@repo/db/data";

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
            <a href={`/post/${post.id}`} className="block focus:outline-none outline-none">
              <article className="flex flex-col md:flex-row">
                {/* Image side */}
                <div className="md:w-56 md:flex-shrink-0">
                  <img
                    src={`https://picsum.photos/seed/${post.id}/500/300`}
                    alt={post.title}
                    className="h-48 w-full object-cover md:h-full"
                  />
                </div>

                {/* Info side */}
                <div className="p-4 flex-1 ">
                  <div className="mb-1 text-xs uppercase tracking-wide">
                    {post.date.toLocaleString("en-AU", {day: "numeric", month: "long", year: "numeric"})} {post.category}
                  </div>
                  <h3 className="font-semibold">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm">
                    {post.description}
                  </p>
                  <div className="mt-4 border-t border-gray-200 pt-3 text-sm text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>
                        Views{" "}
                        {(
                          post as Post & { views?: number }
                        ).views ?? 0}
                      </span>
                      <span>
                        Likes{" "}
                        {(
                          post as Post & { likes?: number }
                        ).likes ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlogList;
