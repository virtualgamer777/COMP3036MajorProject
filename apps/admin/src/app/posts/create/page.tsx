"use server"

import { redirect } from 'next/navigation';
import { isLoggedIn } from '../../../utils/auth';
import Editor from '../../../components/editor/editor';

export default async function Create() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect('/');
  }

  return (
    <main>
      <Editor initialPost={null}/>
    </main>
  );
}