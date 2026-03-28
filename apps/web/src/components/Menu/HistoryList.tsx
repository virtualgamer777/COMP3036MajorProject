import { history } from "@/functions/history";
import { type Post } from "@repo/db/data";
import { JSX } from "react";
import { SummaryItem } from "./SummaryItem";
import { toUrlPath } from "@repo/utils/url";

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: Post[];
}) {
  const historyItems = history(posts);

  // TODO: use the "history" function on "functions" directory to get the history
  //       and render all history items using the SummaryItem component
  return (
    <>
      {historyItems.map((item) => {
        const monthName = months[item.month];
        const name = `${monthName}, ${item.year}`;
        const isSelected = selectedYear === item.year.toString() && selectedMonth === item.month.toString();
        
        return (
          <SummaryItem
            key={`${item.year}-${item.month}`}
            name={name}
            count={item.count}
            link={`/history/${item.year}/${item.month}`}
            isSelected={isSelected}
            title={`History / ${name}`}
          />
        );
      })}
    </>
  );

  // return list;
}
