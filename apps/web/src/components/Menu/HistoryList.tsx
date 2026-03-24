import { history } from "@/functions/history";
import { type Post } from "@repo/db/data";
import { JSX } from "react";

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
  const list: JSX.Element[] = []
  historyItems.forEach((item) => {
    list.push(<div>{item}</div>)
  });

  return list;
}
