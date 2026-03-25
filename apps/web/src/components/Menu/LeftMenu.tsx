import { posts } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export function LeftMenu() {
  return (
    // modify the div so its to the left with a gray seperator
    <div className="w-64 shrink-0 h-full border-r border-gray-200 dark:border-gray-700 px-4 py-4 overflow-y-auto">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <nav>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <div className="text-primary">Categories</div>
            <CategoryList posts={posts} />
          </li>
          <li>
            <div className="text-primary">History</div>
            <HistoryList selectedYear="" selectedMonth="" posts={posts} />
          </li>
          <li>
            <div className="text-primary">Tags</div>
            <TagList selectedTag="" posts={posts} />
          </li>
          <li>Admin</li>
        </ul>
      </nav>
    </div>
  );
}
