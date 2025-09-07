import { z } from "zod";

export const subjectXPSchema = z.object({
  Math: z.number(),
  Physics: z.number(),
  Chemistry: z.number(),
  Biology: z.number(),
  History: z.number(),
});

export const pastPaperSchema = z.object({
  id: z.number(),
  title: z.string(),
  subject: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  board: z.string(),
  url: z.string(),
});

export const questSchema = z.object({
  id: z.number(),
  title: z.string(),
  xp: z.number(),
  completed: z.boolean(),
});

export const settingsSchema = z.object({
  xpMultiplier: z.number(),
});

export const appStateSchema = z.object({
  xp: subjectXPSchema,
  pastPapers: z.array(pastPaperSchema),
  quests: z.array(questSchema),
  settings: settingsSchema,
  studyStreak: z.array(z.number()),
});

export type SubjectXP = z.infer<typeof subjectXPSchema>;
export type PastPaper = z.infer<typeof pastPaperSchema>;
export type Quest = z.infer<typeof questSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type AppState = z.infer<typeof appStateSchema>;
