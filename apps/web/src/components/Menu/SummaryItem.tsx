"use server"

import Link from "next/link";

export async function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  // TODO: Implement the summary item
  // must show the number of posts in that category and the name
  // if if is selected it must show in different color/background
  return (
    <div>
      <Link
        href={link}
        title={title ?? name}
        aria-current={isSelected ? "page" : undefined}
        className={`flex items-center justify-between rounded-md px-3 py-2 ${
          isSelected
            ? "text-primary selected"
            : "text-secondary hover:bg-gray-100 dark:hover:bg-gray-900"
        }`}
      >
        <span>{name}</span>
        <span className="text-sm" data-test-id="post-count">{count}</span>
      </Link>
    </div>
  );
}
