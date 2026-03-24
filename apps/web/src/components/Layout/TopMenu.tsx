"use client";

import { useRouter } from "next/navigation";
import ThemeSwitch from "../Themes/ThemeSwitcher";

function debounce<T extends (...args: Any[]) => Any>(fn: T, delay = 300) {
  let timeoutId: Any;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function TopMenu({ query }: { query?: string }) {
  const router = useRouter();

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      router.push(`/search?q=${encodeURIComponent(search)}`);
    },
  );

  // TODO: create and hook the search input to the handleSearch function
  //       make sure you are able to explain what the handleSearch is doing and what debounce does

  // return (
  //   <div>
  //     <form action="#" method="GET" className="grid flex-1 grid-cols-1">
  //       <input
  //         type="search"
  //         defaultValue={query ?? ""}
  //         onChange={handleSearch}
  //         placeholder="Search posts..."
  //         className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
  //       />
  //     </form>
  //     <div className="flex items-center gap-x-6">
  //       <ThemeSwitch />
  //     </div>
  //   </div>
  // );
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
      <form action="#" method="GET" className="min-w-0">
        <input
          type="search"
          defaultValue={query ?? ""}
          onChange={handleSearch}
          placeholder="Search posts..."
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
      </form>
      <div className="justify-self-end">
        <ThemeSwitch />
      </div>
    </div>
  );
}
