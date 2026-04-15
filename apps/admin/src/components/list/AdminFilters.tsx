"use client";

import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function AdminFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const contentRef = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const visibilityRef = useRef<HTMLSelectElement>(null);
  const sortRef = useRef<HTMLSelectElement>(null);

  const updateFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    const content = contentRef.current?.value.trim() ?? "";
    const tag = tagRef.current?.value.trim() ?? "";
    const date = dateRef.current?.value.trim() ?? "";
    const visibility = visibilityRef.current?.value ?? "all";
    const sort = sortRef.current?.value ?? "date-desc";

    if (content) params.set("q", content);
    else params.delete("q");

    if (tag) params.set("tag", tag);
    else params.delete("tag");

    if (date) params.set("date", date);
    else params.delete("date");

    if (visibility === "all") params.delete("visibility");
    else params.set("visibility", visibility);

    if (sort === "date-desc") params.delete("sort");
    else params.set("sort", sort);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div>
          <label htmlFor="contentFilter" className="mb-1 block text-sm font-medium text-gray-700">
            Filter by Content:
          </label>
          <input
            ref={contentRef}
            id="contentFilter"
            type="search"
            defaultValue={searchParams.get("q") ?? ""}
            onChange={updateFilters}
            placeholder="Search posts..."
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label htmlFor="tagFilter" className="mb-1 block text-sm font-medium text-gray-700">
            Filter by Tag:
          </label>
          <input
            ref={tagRef}
            id="tagFilter"
            type="search"
            defaultValue={searchParams.get("tag") ?? ""}
            onChange={updateFilters}
            placeholder="Tag..."
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label htmlFor="dateFilter" className="mb-1 block text-sm font-medium text-gray-700">
            Filter by Date Created:
          </label>
          <input
            ref={dateRef}
            id="dateFilter"
            type="text"
            defaultValue={searchParams.get("date") ?? ""}
            onChange={updateFilters}
            placeholder="DDMMYYYY"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label htmlFor="visibilityFilter" className="mb-1 block text-sm font-medium text-gray-700">
            Filter by Visibility:
          </label>
          <select
            ref={visibilityRef}
            id="visibilityFilter"
            defaultValue={searchParams.get("visibility") ?? "all"}
            onChange={updateFilters}
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
            ref={sortRef}
            id="sortBy"
            defaultValue={searchParams.get("sort") ?? "date-desc"}
            onChange={updateFilters}
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
  );
}