"use server"

import { getPosts, Post } from "@repo/db/data";
import { isLoggedIn } from "../utils/auth";
import styles from "./page.module.css";
import Login from "../components/auth/login";
import { AppLayout } from "../components/layout/AppLayout";
import Link from "next/link";
import { AdminDashboard } from "../components/list/AdminDashboard";

type HomeProps = {
  searchParams?: Promise<{ error?: string; q?: string; tag?: string; date?: string; visibility?: string; sort?: string }>;
};



export default async function Home({ searchParams }: HomeProps) {
  // use the is logged in function to check if user is authorised
  // we will use the cookie based approach
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    const params = searchParams ? await searchParams : undefined;
    return <main><Login error={params?.error}></Login></main>;
  } 

  //console.log(getPosts());

  const params = await searchParams;


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

        <AdminDashboard
          posts={getPosts()}
          initialQuery={{
            q: params?.q ?? "",
            tag: params?.tag ?? "",
            date: params?.date ?? "",
            visibility: params?.visibility ?? "all",
            sort: params?.sort ?? "date-desc",
          }}
        />
      </div>
    </AppLayout>
  );
  
}
