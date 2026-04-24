"use server"

import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { SummaryItem } from "./SummaryItem";

export async function CategoryList({ posts }: { posts: Post[] }) {
  // TODO: Implement proper category list
  
  const staticCategories = [
    { name: "React", link: "/category/react", count: 0 },
    { name: "Node", link: "/category/node", count: 0 },
    { name: "Mongo", link: "/category/mongo", count: 0 },
    { name: "DevOps", link: "/category/devops", count: 0 },
  ];

  //get the count
  const categoriesWithCount = staticCategories.map((category) => ({ ...category }));
  posts.filter((post) => post.active)
    .forEach((post) => {
      const match = categoriesWithCount.find(
        (category) => category.name.toLowerCase() === post.category.toLowerCase(),
      );

      if (match) {
        match.count += 1;
      }
    });

  return (
    <>
      {categoriesWithCount.map((item) => (
        <SummaryItem
          key={item.name}
          count={item.count}
          name={item.name}
          isSelected={false}
          link={item.link}
          title={`Category / ${item.name}`}
          data-test-id="post-count"
        />
      ))}
    </>
  );
  
  return (
    <>
      {categories(posts).map((item) => (
        <SummaryItem
          key={item.name}
          count={item.count}
          name={item.name}
          isSelected={false}
          link={`/category/${toUrlPath(item.name)}`}
          title=""
        />
      ))}
    </>
  );
}
