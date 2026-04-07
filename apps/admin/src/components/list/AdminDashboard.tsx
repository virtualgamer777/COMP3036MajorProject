"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Post } from "@repo/db/data";
import { AdminList } from "./List";

type QueryState = {
  q: string;
  tag: string;
  date: string;
  visibility: string;
  sort: string;
};

function filterAndSortPosts(
  posts: Post[],
  content: string,
  tag: string,
  date: string,
  visibility: string,
  sort: string,
): Post[] {
  let result = posts;

  if (content) {
    const q = content.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q),
    );
  }

  if (tag) {
    const q = tag.toLowerCase();
    result = result.filter((p) => p.tags.toLowerCase().includes(q));
  }

  if (date) {
    const day = Number(date.slice(0, 2));
    const month = Number(date.slice(2, 4));
    //const day = 1;
    //const month = 1;
    const year = Number(date.slice(4, 8));
    const filterDate = new Date(year, month - 1, day);
    result = result.filter((p) => {
      const postDate = new Date(p.date);
      postDate.setHours(0, 0, 0, 0);
      return postDate.getTime() >= filterDate.getTime();
    });
  }

  if (visibility === "active") result = result.filter((p) => p.active);
  if (visibility === "inactive") result = result.filter((p) => !p.active);

  return [...result].sort((a, b) => {
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
}

export function AdminDashboard({
  posts,
  initialQuery,
}: {
  posts: Post[];
  initialQuery: QueryState;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState<QueryState>(initialQuery);

  const filteredPosts = useMemo(
    () =>
      filterAndSortPosts(
        posts,
        query.q,
        query.tag,
        query.date,
        query.visibility,
        query.sort,
      ),
    [posts, query],
  );

  const updateQuery = (nextQuery: QueryState) => {
    setQuery(nextQuery);

    const params = new URLSearchParams();
    if (nextQuery.q) params.set("q", nextQuery.q);
    if (nextQuery.tag) params.set("tag", nextQuery.tag);
    if (nextQuery.date) params.set("date", nextQuery.date);
    if (nextQuery.visibility !== "all") params.set("visibility", nextQuery.visibility);
    if (nextQuery.sort !== "date-desc") params.set("sort", nextQuery.sort);

    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  };

  return (
    <>
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div>
            <label htmlFor="contentFilter" className="mb-1 block text-sm font-medium text-gray-700">
              Filter by Content:
            </label>
            <input
              id="contentFilter"
              type="search"
              value={query.q}
              onChange={(event) => updateQuery({ ...query, q: event.target.value })}
              placeholder="Search posts..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label htmlFor="tagFilter" className="mb-1 block text-sm font-medium text-gray-700">
              Filter by Tag:
            </label>
            <input
              id="tagFilter"
              type="search"
              value={query.tag}
              onChange={(event) => updateQuery({ ...query, tag: event.target.value })}
              placeholder="Tag..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label htmlFor="dateFilter" className="mb-1 block text-sm font-medium text-gray-700">
              Filter by Date Created:
            </label>
            <input
              id="dateFilter"
              type="text"
              inputMode="numeric"
              value={query.date}
              onChange={(event) => {
                const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 8);
                updateQuery({ ...query, date: digitsOnly });
              }}
              placeholder="DDMMYYYY"
              pattern="\d{8}"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label htmlFor="visibilityFilter" className="mb-1 block text-sm font-medium text-gray-700">
              Filter by Visibility:
            </label>
            <select
              id="visibilityFilter"
              value={query.visibility}
              onChange={(event) => updateQuery({ ...query, visibility: event.target.value })}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label htmlFor="sortBy" className="mb-1 block text-sm font-medium text-gray-700">
              Sort By:
            </label>
            <select
              id="sortBy"
              value={query.sort}
              onChange={(event) => updateQuery({ ...query, sort: event.target.value })}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
            >
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="date-desc">Date (Newest)</option>
            </select>
          </div>
        </div>
      </div>

      <AdminList posts={filteredPosts} />
    </>
  );
}