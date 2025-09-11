import { z } from "zod";
import { sql } from 'drizzle-orm';
import { index, jsonb, pgTable, timestamp, varchar, serial, integer, boolean, text } from "drizzle-orm/pg-core";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const subjectXPSchema = z.object({
  Maths: z.number(), // Maths Edexcel
  EnglishLanguage: z.number(), // English Language AQA
  EnglishLiterature: z.number(), // English Literature AQA
  Physics: z.number(), // Physics AQA
  French: z.number(), // French AQA
  Business: z.number(), // Business AQA
  Biology: z.number(), // Biology AQA
  ComputerScience: z.number(), // Computer Science AQA
  PE: z.number(), // Physical Education AQA
  Chemistry: z.number(), // Chemistry - Combined Science AQA
});

export const pastPaperSchema = z.object({
  id: z.number(),
  title: z.string(),
  subject: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  board: z.enum(['AQA', 'Edexcel', 'OCR', 'WJEC', 'CIE']),
  year: z.number(),
  season: z.enum(['January', 'May/June', 'October/November']),
  paperNumber: z.string(),
  topics: z.array(z.string()),
  curriculumCode: z.string(),
  url: z.string(),
  downloadUrl: z.string().optional(),
  markSchemeUrl: z.string().optional(),
});

export const questSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  xp: z.number(),
  completed: z.boolean(),
  subject: z.string(),
  topics: z.array(z.string()),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  estimatedTime: z.string(),
  questType: z.enum(['daily', 'weekly', 'custom']),
  weekNumber: z.number().optional(), // For weekly quests
  year: z.number().optional(), // For weekly quests
  resources: z.array(z.string()).optional(),
  tips: z.array(z.string()).optional(),
});

export const weeklyQuestSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  xp: z.number(),
  completed: z.boolean(),
  subject: z.string(),
  topics: z.array(z.string()),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  estimatedTime: z.string(),
  weekNumber: z.number(),
  year: z.number(),
  resources: z.array(z.string()),
  tips: z.array(z.string()),
  requirements: z.array(z.string()),
});

export const settingsSchema = z.object({
  xpMultiplier: z.number(),
});

export const resourceSchema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string(),
  description: z.string(),
  subjects: z.array(z.string()),
  type: z.enum(['Website', 'PDF', 'Video', 'Interactive', 'Past Papers']),
  free: z.boolean(),
  difficulty: z.enum(['Foundation', 'Higher', 'All']),
});

export const appStateSchema = z.object({
  version: z.string().optional(), // Migration version tracking
  xp: subjectXPSchema,
  pastPapers: z.array(pastPaperSchema),
  quests: z.array(questSchema),
  settings: settingsSchema,
  studyStreak: z.array(z.number()),
  resources: z.array(resourceSchema),
});

export type SubjectXP = z.infer<typeof subjectXPSchema>;
export type PastPaper = z.infer<typeof pastPaperSchema>;
export type Quest = z.infer<typeof questSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type Resource = z.infer<typeof resourceSchema>;
export type AppState = z.infer<typeof appStateSchema>;
