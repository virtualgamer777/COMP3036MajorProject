import { type Post } from "@repo/db/data";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import { toUrlPath } from "@repo/utils/url";
import { SummaryItem } from "./SummaryItem";

export async function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {
  //get tags
  const postTags = await tags(posts);

  //display tags
  return (
    <>
      {postTags.map((tag) => (
        <SummaryItem
          key={tag.name}
          count={tag.count}
          name={tag.name}
          isSelected={selectedTag === tag.name}
          link={`/tags/${toUrlPath(tag.name)}`}
          title={`Tag / ${tag.name}`}
        />
      ))}
    </>
  );


  // return (
  //   <LinkList title="Tags">
  //     Tags {/* Todo implement, use the summary item */}
  //   </LinkList>
  // );
}
