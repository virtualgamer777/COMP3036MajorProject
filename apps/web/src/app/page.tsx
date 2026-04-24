"use server"

import { getPosts } from "@repo/db/data";
import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import styles from "./page.module.css";
export default async function Home() {
  return (
    <AppLayout>
      <Main posts={await getPosts()} className={styles.main} />
    </AppLayout>
  );
}
