import {
  boolean,
  integer,
  pgTable,
  varchar,
  doublePrecision,
  text,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Schema
export const user = pgTable("users", {
  id: integer().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().primaryKey(),
  password: varchar({ length: 256 }),
  salt1: varchar({ length: 512 }),
  salt2: varchar({ length: 512 }),
  role: varchar({ enum: ["owner", "admin", "user"] }),
});

// Session :)
export const session = pgTable("session", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  token: varchar().notNull(),
  userID: integer(),
  expirationTime: varchar().notNull(),
  expired: boolean().notNull().default(false),
});

// Question Collection
export const questionCollection = pgTable("questionCollection", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: varchar().notNull(),
  content: varchar().notNull(),
  creator: varchar(),
});

// Question Log for checking
export const questionLog = pgTable("questionLog", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  questionID: varchar().notNull(),
  userID: integer().notNull(),
  correct: boolean().notNull(),
  timestamp: varchar().notNull(),
});

// Questions for Community
export const question = pgTable("question", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  collectionID: integer().notNull(),
  source: varchar().notNull(),
  question: varchar().notNull(),
  answer: varchar().notNull(),
  difficulty: doublePrecision().notNull(),
  tags: text()
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
});
