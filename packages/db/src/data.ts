import { client } from "./client.js";

export type Post = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  date: Date;
  category: string;
  views: number;
  likes: number;
  tags: string;
  active: boolean;
};

declare global {
  // eslint-disable-next-line no-var
  var __postsStore: Post[] | undefined;
}

const content = `
  # Title 1

  Illo **sint voluptas**. Error voluptates culpa eligendi. 
  Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
  Sed exercitationem placeat consectetur nulla deserunt vel 
  iusto corrupti dicta laboris incididunt.

  ## Subtitle 1

  Illo sint *voluptas*. Error voluptates culpa eligendi. 
  Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
  Sed exercitationem placeat consectetur nulla deserunt vel 
  iusto corrupti dicta laboris incididunt.
`;

const description = `Illo sint voluptas. Error voluptates culpa eligendi. 
Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
Sed exercitationem placeat consectetur nulla deserunt vel 
iusto corrupti dicta laboris incididunt.`;

export const initialPosts: Post[] = [
  {
    id: 1,
    title: "Boost your conversion rate",
    urlId: "boost-your-conversion-rate",
    description,
    content: content + " ... post1",
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: new Date("Apr 18, 2022"),
    category: "Node",
    tags: "Back-End,Databases",
    views: 320,
    likes: 3,
    active: true,
  },
  {
    id: 2,
    title: "Better front ends with Fatboy Slim",
    urlId: "better-front-ends-with-fatboy-slim",
    description: `Illo sint voluptas. Error voluptates culpa eligendi. 
       Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
       Sed exercitationem placeat consectetur nulla deserunt vel 
       iusto corrupti dicta laboris incididunt.`,
    content: content + " ... post2",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661342428515-5ca8cee4385a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3",
    date: new Date("Mar 16, 2020"),
    category: "React",
    tags: "Front-End,Optimisation",
    views: 10,
    likes: 1,
    active: true,
  },
  {
    id: 3,
    title: "No front end framework is the best",
    urlId: "no-front-end-framework-is-the-best",
    description: `Illo sint voluptas. Error voluptates culpa eligendi. 
       Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
       Sed exercitationem placeat consectetur nulla deserunt vel 
       iusto corrupti dicta laboris incididunt.`,
    content: content + " ... post3",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661517706036-a48d5fc8f2f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    date: new Date("Dec 16, 2024"),
    category: "React",
    tags: "Front-End,Dev Tools",
    views: 22,
    likes: 2,
    active: true,
  },
  {
    id: 4,
    title: "Visual Basic is the future",
    urlId: "visual-basic-is-the-future",
    description: `Illo sint voluptas. Error voluptates culpa eligendi. 
       Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
       Sed exercitationem placeat consectetur nulla deserunt vel 
       iusto corrupti dicta laboris incididunt.`,
    content: content + " ... post4",
    imageUrl: "https://m.media-amazon.com/images/I/51NqEfmmBTL.jpg",
    date: new Date("Dec 16, 2012"),
    category: "React",
    tags: "Programming,Mainframes",
    views: 22,
    likes: 1,
    active: false,
  },
];

const clonePosts = () => initialPosts.map((p) => ({ ...p, date: new Date(p.date) }));

export async function retrieveAllPosts() {
  const rows = await client.db.post.findMany({
    orderBy: { id: "asc" },
  });
  const tempPosts: Post[] = rows.map((row) => ({
    id: row.id,
    urlId: row.urlId,
    title: row.title,
    content: "",
    description: "",
    imageUrl: "",
    date: row.date,
    category: "",
    views: row.views,
    likes: 0,
    tags: row.tags,
    active: row.active,
  }));

  return tempPosts;
}

// export const posts = globalThis.__postsStore ?? (globalThis.__postsStore = clonePosts());
export const posts = globalThis.__postsStore ?? (globalThis.__postsStore = await retrieveAllPosts());


export async function reset() {
  posts.length = 0;
  posts.push(...await retrieveAllPosts());
}

export function getPosts(): Post[] {
  return posts;
}

export async function appendPost(post: Post) {
  await client.db.post.create({
    data: {
      title: post.title,
      content: post.content,
      category: post.category,
      description: post.description,
      imageUrl: post.imageUrl,
      tags: post.tags
        .split(",")
        .map((p) => p.trim())
        .join(","),
      urlId: post.urlId,
      active: post.active,
      date: post.date,
      id: post.id,
      views: post.views,
    },
  });
  posts.push(post);
}

export async function upsertPost(post: Post) {
  const existing = posts.find(
    (current) => current.id === post.id || current.urlId === post.urlId,
  );

  await client.db.post.upsert({
    where: { urlId: post.urlId },
    update: {
      title: post.title,
      tags: post.tags,
      date: post.date,
      views: post.views,
      active: post.active,
    },
    create: {
      id: post.id,
      urlId: post.urlId,
      title: post.title,
      tags: post.tags,
      date: post.date,
      views: post.views,
      active: post.active,
    },
  });

  if (existing) {
    Object.assign(existing, post);
    return;
  }

  posts.push(post);
}
