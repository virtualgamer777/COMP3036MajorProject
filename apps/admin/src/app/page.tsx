import { posts } from "@repo/db/data";
import { isLoggedIn } from "../utils/auth";
import styles from "./page.module.css";
import Login from "../components/auth/login";
import { AppLayout } from "../components/layout/AppLayout";

type HomeProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  // use the is logged in function to check if user is authorised
  // we will use the cookie based approach
  const loggedIn = await isLoggedIn();
  

  if (!loggedIn) {
    const params = searchParams ? await searchParams : undefined;
    return <main><Login error={params?.error}></Login></main>;
  } else {
    return (
      <AppLayout>
        Admin of Full Stack Blog
        <ul>
          {posts.map((p) => (
            <li key={p.id}>{p.title}</li>
          ))}
        </ul>
      </AppLayout>
    );
  }
}
