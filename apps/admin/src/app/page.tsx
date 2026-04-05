import { Post, posts } from "@repo/db/data";
import { isLoggedIn } from "../utils/auth";
import styles from "./page.module.css";
import Login from "../components/auth/login";
import { AppLayout } from "../components/layout/AppLayout";
import { AdminList } from "../components/list/List";
import Link from "next/link";
import { AdminFilters } from "../components/list/AdminFilters";

type HomeProps = {
  searchParams?: Promise<{ error?: string; q?: string; tag?: string; date?: string; visibility?: string; sort?: string }>;
};

//handle all the post filtering
function filterAndSortPosts(
  posts: Post[],
  content: string,
  tag: string,
  date: string,
  visibility: string,
  sort: string
): Post[] {
  let result = posts;

  if (content) {
    const q = content.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
    );
  }

  if (tag) {
    const q = tag.toLowerCase();
    result = result.filter((p) => p.tags.toLowerCase().includes(q));
  }

  if (date) {
    const day = Number(date.slice(0, 2));
    const month = Number(date.slice(2, 4));
    const year = Number(date.slice(4, 8));
    const filterDate = new Date(year, month - 1, day);
    result = result.filter(
      (p) =>
        p.date.toDateString() === filterDate.toDateString()
    );
  }

  if (visibility === "active") result = result.filter((p) => p.active);
  if (visibility === "inactive") result = result.filter((p) => !p.active);

  result.sort((a, b) => {
    switch (sort) {
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "date-asc":
        return a.date.getTime() - b.date.getTime();
      case "date-desc":
      default:
        return b.date.getTime() - a.date.getTime();
    }
  });

  return result;
}


export default async function Home({ searchParams }: HomeProps) {
  // use the is logged in function to check if user is authorised
  // we will use the cookie based approach
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    const params = searchParams ? await searchParams : undefined;
    return <main><Login error={params?.error}></Login></main>;
  } 

  const params = await searchParams;
  const contentQ = params?.q || "";
  const tagQ = params?.tag || "";
  const dateQ = params?.date || "";
  const visibilityQ = params?.visibility || "all";
  const sortQ = params?.sort || "date-desc";

  const filteredPosts = filterAndSortPosts(
    posts,
    contentQ,
    tagQ,
    dateQ,
    visibilityQ,
    sortQ
  );

  const autoSubmitAttrs = {
    onInput: "this.form.requestSubmit()",
    onChange: "this.form.requestSubmit()",
  } as any;


  return (
    <AppLayout>
      <div className="px-6 py-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin of Full Stack Blog</h1>
          <Link
            href="/posts/create"
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Create Post
          </Link>
        </div>

        <AdminFilters/>

        <AdminList posts={filteredPosts} />
      </div>
    </AppLayout>
  );
  
}
