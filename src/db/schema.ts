import {
  boolean,
  pgTable,
  varchar,
  doublePrecision,
  bigint,
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Schema
export const user = pgTable("users", {
  id: bigint({ mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 256 }),
  salt1: varchar({ length: 512 }),
  salt2: varchar({ length: 512 }),
  role: varchar({ enum: ["owner", "admin", "user"] }),
  active: varchar({enum: ['active', 'suspended']}).default("active"),
  dateCreated: date().default(new Date().toDateString()),
  loginCount: bigint({mode: "number"}).default(0),
});

// Session :)
export const session = pgTable("session", {
  id: bigint({ mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
  token: varchar().notNull(),
  userID: bigint({ mode: "number" }).references(() => user.id),
  expirationTime: varchar().notNull(),
  expired: boolean().notNull().default(false),
});

// Question Collection
export const questionCollection = pgTable("questionCollection", {
  id: bigint({ mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
  name: varchar().notNull(),
  content: varchar().notNull(),
  creatorID: bigint({ mode: "number" }).references(() => user.id),
  publicID: varchar(),
  tags: varchar()
    .array()
    .notNull()
    .default(sql`'{}'::varchar[]`),
  plays: bigint({ mode: "number" }).default(0),
});

// Question Log for checking
export const questionLog = pgTable("questionLog", {
  id: bigint({ mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
  questionID: varchar(),
  userID: bigint({ mode: "number" })
    .notNull()
    .references(() => user.id),
  correct: boolean().notNull(),
  timestamp: varchar().notNull(),
  response: varchar().notNull(),
  // Needed for question collection bulk deletion
  // deleting all logs for a set
  collectionID: bigint({ mode: "number" }),
  // Check based on the traditional collection
  questionSet: varchar(),
  questionSetID: varchar(),
});

// Questions for Community
export const question = pgTable("question", {
  id: bigint({ mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
  collectionID: bigint({ mode: "number" })
    .notNull()
    .references(() => questionCollection.id),
  type: varchar({ length: 256 }),
  questionName: varchar({ length: 4096 }),
  difficulty: doublePrecision(),
  questionCollectionTagName: varchar()
    .array()
    .notNull()
    .default(sql`'{}'::varchar[]`),
  answerChoices: varchar()
    .array()
    .notNull()
    .default(sql`'{}'::varchar[]`),
  correctAnswer: varchar({length: 4096})
  .array()
  .notNull()
  .default(sql`'{}'::varchar[]`),
});

/*
  Analytics
*/
export const analytics = pgTable("analytics", {
  id: bigint({ mode: "number" }).generatedAlwaysAsIdentity().primaryKey(),
  userID: bigint({ mode: "number" })
    .notNull()
    .references(() => user.id),
  tagName: varchar(),
  score: bigint({ mode: "number" }),
});

// export const explanations = pgTable("explanations", {
//   id: bigint({mode: "number"}).generatedAlwaysAsIdentity().primaryKey(),
//   questionCID: bigint({mode: "number"}),
//   questionID: varchar(),
//   explanation: varchar(  questionCID: bigint({mode: "number"}))``
// })