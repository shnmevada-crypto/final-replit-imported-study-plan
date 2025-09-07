import type { AppState } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Add any storage methods needed for the study dashboard
}

export class MemStorage implements IStorage {
  // Placeholder storage implementation
}

export const storage = new MemStorage();
