import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiAssistant } from "./aiService";

export async function registerRoutes(app: Express): Promise<Server> {
  // AI endpoints
  app.post('/api/ai/study-tip', async (req, res) => {
    try {
      const { xpData } = req.body;
      const tip = await aiAssistant.generatePersonalizedTip(xpData);
      res.json(tip);
    } catch (error) {
      console.error('AI Study Tip Error:', error);
      res.status(500).json({ error: 'Failed to generate study tip' });
    }
  });

  app.post('/api/ai/quests', async (req, res) => {
    try {
      const { xpData, completedQuests } = req.body;
      const quests = await aiAssistant.generateSmartQuests(xpData, completedQuests);
      res.json(quests);
    } catch (error) {
      console.error('AI Quest Generation Error:', error);
      res.status(500).json({ error: 'Failed to generate quests' });
    }
  });

  app.post('/api/ai/recommendations', async (req, res) => {
    try {
      const { xpData, currentSubject } = req.body;
      const recommendations = await aiAssistant.getResourceRecommendations(xpData, currentSubject);
      res.json(recommendations);
    } catch (error) {
      console.error('AI Recommendations Error:', error);
      res.status(500).json({ error: 'Failed to generate recommendations' });
    }
  });

  app.post('/api/ai/study-plan', async (req, res) => {
    try {
      const { xpData, timeAvailable } = req.body;
      const plan = await aiAssistant.generateStudyPlan(xpData, timeAvailable);
      res.json({ content: plan });
    } catch (error) {
      console.error('AI Study Plan Error:', error);
      res.status(500).json({ error: 'Failed to generate study plan' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
