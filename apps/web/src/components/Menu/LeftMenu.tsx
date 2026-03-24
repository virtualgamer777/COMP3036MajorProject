import { posts } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

export function LeftMenu() {
  return (
    // modify the div so its to the left with a gray seperator
    <div className="w-64 shrink-0 h-full border-r border-gray-200 dark:border-gray-700 px-4 py-4 overflow-y-auto">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div>Top Links and blog name</div>
      <nav>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <CategoryList posts={posts} />
          </li>
          <li>
            <h6>History</h6>
            <HistoryList selectedYear="" selectedMonth="" posts={posts} />
          </li>
          <li>
            <h6>Tags</h6>
            <TagList selectedTag="" posts={posts} />
          </li>
          <li>Admin</li>
        </ul>
      </nav>
    </div>
  );
}
