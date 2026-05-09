import { pgTable, serial, varchar, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  urlId: varchar('urlId').unique().notNull(),
  title: varchar('title').notNull(),
  content: text('content').notNull(),
  description: text('description').notNull(),
  imageUrl: varchar('imageUrl').notNull(),
  date: timestamp('date').notNull(),
  category: varchar('category').notNull(),
  views: integer('views').default(0),
  tags: varchar('tags').notNull(),
  active: boolean('active').default(true),
});

export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  postId: integer('postId').references(() => posts.id).notNull(),
  userIP: varchar('userIP').notNull(),
});

export const postsRelations = relations(posts, ({ many }) => ({
  likes: many(likes),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));