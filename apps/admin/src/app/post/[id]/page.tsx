"use server"

import { redirect } from 'next/navigation';
import { isLoggedIn } from '../../../utils/auth';
import Editor from '../../../components/editor/editor';
import { getPosts } from '@repo/db/data';


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect('/');
  }

  //get existing post
  const { id } = await params;
  const post = (await getPosts()).find((p) => p.urlId === id);

  return (
    <main>
      <Editor initialPost={post}/>
    </main>
  );
}