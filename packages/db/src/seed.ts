import { reset, posts } from "./data.js";


export async function seed() {
  const response = await fetch("http://localhost:3002/api/seed", {
    method: "POST",
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Failed to reset posts: ${response.status} ${body}`);
  }

  // TODO: Uncomment below once you set up Prisma and loaded data to your database
  // console.log("🌱 Seeding data");
  // await client.db.like.deleteMany();
  // await client.db.post.deleteMany();
  // for (const post of posts) {
  //   await client.db.post.create({
  //     data: {
  //       title: post.title,
  //       content: post.content,
  //       category: post.category,
  //       description: post.description,
  //       imageUrl: post.imageUrl,
  //       tags: post.tags
  //         .split(",")
  //         .map((p) => p.trim())
  //         .join(","),
  //       urlId: post.urlId,
  //       active: post.active,
  //       date: post.date,
  //       id: post.id,
  //       views: post.views,
  //     },
  //   });
  //   for (let i = 0; i < post.likes; i++) {
  //     await client.db.like.create({
  //       data: {
  //         postId: post.id,
  //         userIP: `192.168.100.${i}`,
  //       },
  //     });
  //   }
  // }
}
