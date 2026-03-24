export function history(posts: { date: Date; active: boolean }[]): string[] {
  
  const dateMap = new Map<string, { month: number; year: number }>();

  posts.forEach((post) => {
    if (!post.active) return; // only active posts
    
    const year = post.date.getFullYear();
    const month = post.date.getMonth() + 1;
    const key = `${year}-${month}`;
    
    if (!dateMap.has(key)) {
      dateMap.set(key, { month, year });
    }
  });

  return [...dateMap.values()]
    .sort((a, b) => {
      // Sort newest first: compare year descending, then month descending
      if (b.year !== a.year) return b.year - a.year;
      return b.month - a.month;
    })
    .map((item) => {
      const date = new Date(item.year, item.month - 1, 1);
      return date.toLocaleString("en-US", { month: "long" }) + ", " + item.year;
    });

  // Implement per specification
  // Return the ordered list of "month, year" strings sorted from most recent to oldes
  // consider only active posts
}
