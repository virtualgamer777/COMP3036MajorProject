import { BlogDetail } from "@/components/Blog/Detail";
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
      <BlogDetail post={post}></BlogDetail>
    </AppLayout>
  );

  
}
