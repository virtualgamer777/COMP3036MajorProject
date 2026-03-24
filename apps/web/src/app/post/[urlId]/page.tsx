import { AppLayout } from "@/components/Layout/AppLayout";
import { Post } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  return <AppLayout>Article not found</AppLayout>;
}
