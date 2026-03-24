import { BlogListItem } from "@/components/Blog/ListItem";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Post, posts } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { Marked, marked } from "marked";


export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;
  const post = posts.find((p) => String(toUrlPath(p.title)) === urlId); // get post
  if(!post) // return if not found
  {
    return <AppLayout>Article not found</AppLayout>;
  }

  //if here
  return(
    <AppLayout>
      <article className="mx-auto max-w-3xl py-8 flex flex-col items-center">
        <div className="p-4 flex-1 ">
          <div className="mb-1 text-xs uppercase tracking-wide">
            {post.date.toLocaleString("en-AU", {day: "2-digit", month: "short", year: "numeric"})} 
            &nbsp;&nbsp;{post.category}
          </div>
          {post.title}
          <div className="md:w-200 md:flex-shrink-0">
            <img
              src={`https://picsum.photos/seed/${post.id}/500/300`}
              alt={post.title}
              className="h-48 w-full object-cover md:h-full"
            />
          </div>
          <div className="mt-2 text-sm text-secondary" dangerouslySetInnerHTML={{__html: await marked(post.content)}}>
          </div>
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
    </AppLayout>
  );

  
}
