import { client } from "./client.js";
import { reset, posts, initialPosts } from "./data.js";
import { posts as postsTable, likes as likesTable } from "./schema.js";

export async function seed() {
  console.log("🌱 Seeding data");
  
  // Delete all likes first (foreign key constraint)
  await client.db.delete(likesTable);
  
  // Delete all posts
  await client.db.delete(postsTable);
  
  // Insert posts and create likes
  for (const post of initialPosts) {
    await client.db.insert(postsTable).values({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      description: post.description,
      imageUrl: post.imageUrl,
      tags: post.tags
        .split(",")
        .map((p: string) => p.trim())
        .join(","),
      urlId: post.urlId,
      active: post.active,
      date: post.date,
      views: post.views,
    });

    // Create likes for this post
    for (let i = 0; i < post.likes; i++) {
      await client.db.insert(likesTable).values({
        postId: post.id,
        userIP: `192.168.100.${i}`,
      });
    }
  }

  // Reset data by calling endpoint
  const response = await fetch("http://localhost:3002/api/seed", {
    method: "POST",
  });

  // Catch errors
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Failed to reset posts: ${response.status} ${body}`);
  }
}