// import { posts, type Post } from "../components/data";

export async function tags(posts: { tags: string; active: boolean }[]) {
  const tagMap = new Map<string, number>();
  
  //iterate over tasks
  posts.forEach((post) => {
    if (!post.active) return; // only active posts
    
    //get all present tags in post
    const postTags = post.tags.split(",").map(tag => tag.trim());
    postTags.forEach((tag) => {
      if (tag) {
        tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
      }
    });
  });

  return [...tagMap.entries()]
    .map(([name, count]) => ({ name, count }));
}
