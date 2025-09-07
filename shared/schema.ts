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
  xp: z.number(),
  completed: z.boolean(),
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
