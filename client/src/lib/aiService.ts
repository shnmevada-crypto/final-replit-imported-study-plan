import type { SubjectXP, Quest } from "@shared/schema";

export interface AIStudyTip {
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  subjects: string[];
  estimatedTime: string;
}

export interface AIQuest {
  title: string;
  description: string;
  xp: number;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
}

export interface AIRecommendation {
  type: 'resource' | 'topic' | 'practice';
  title: string;
  description: string;
  actionUrl?: string;
  priority: number;
}

export class AIStudyAssistant {
  
  async generatePersonalizedTip(xpData: SubjectXP): Promise<AIStudyTip> {
    try {
      const response = await fetch('/api/ai/study-tip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ xpData })
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI tip');
      }

      const tip = await response.json();
      return tip;
    } catch (error) {
      console.error('AI Tip Generation Error:', error);
      return this.getFallbackTip(xpData);
    }
  }

  async generateSmartQuests(xpData: SubjectXP, completedQuests: Quest[]): Promise<AIQuest[]> {
    try {
      const response = await fetch('/api/ai/quests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ xpData, completedQuests })
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI quests');
      }

      const quests = await response.json();
      return quests;
    } catch (error) {
      console.error('AI Quest Generation Error:', error);
      return this.getFallbackQuests();
    }
  }

  async getResourceRecommendations(xpData: SubjectXP, currentSubject?: string): Promise<AIRecommendation[]> {
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ xpData, currentSubject })
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI recommendations');
      }

      const recommendations = await response.json();
      return recommendations;
    } catch (error) {
      console.error('AI Recommendation Error:', error);
      return this.getFallbackRecommendations();
    }
  }

  async generateStudyPlan(xpData: SubjectXP, timeAvailable: string): Promise<string> {
    try {
      const response = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ xpData, timeAvailable })
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI study plan');
      }

      const plan = await response.json();
      return plan.content || this.getFallbackStudyPlan();
    } catch (error) {
      console.error('AI Study Plan Error:', error);
      return this.getFallbackStudyPlan();
    }
  }

  // Fallback methods for when AI is unavailable
  private getFallbackTip(xpData: SubjectXP): AIStudyTip {
    const subjects = Object.entries(xpData).sort((a, b) => a[1] - b[1]);
    const weakest = subjects[0][0];
    
    return {
      title: `Focus on ${weakest}`,
      content: `Your ${weakest} XP is lower than other subjects. Try 20 minutes of active recall and 3 targeted practice questions.`,
      priority: 'high',
      subjects: [weakest],
      estimatedTime: "20 minutes"
    };
  }

  private getFallbackQuests(): AIQuest[] {
    return [
      {
        title: "Complete 10 practice questions",
        description: "Work through 10 challenging problems in your weakest subject",
        xp: 30,
        subject: "Math",
        difficulty: "Medium",
        estimatedTime: "25 minutes"
      },
      {
        title: "Review key concepts",
        description: "Summarize 3 important topics from recent lessons",
        xp: 25,
        subject: "Physics",
        difficulty: "Easy", 
        estimatedTime: "20 minutes"
      },
      {
        title: "Watch educational video",
        description: "Find and watch a tutorial on a challenging topic",
        xp: 20,
        subject: "Chemistry",
        difficulty: "Easy",
        estimatedTime: "15 minutes"
      }
    ];
  }

  private getFallbackRecommendations(): AIRecommendation[] {
    return [
      {
        type: "practice",
        title: "Focus on weak areas",
        description: "Spend extra time on subjects with lower XP scores",
        priority: 8
      },
      {
        type: "resource",
        title: "Use active recall techniques",
        description: "Test yourself regularly instead of just re-reading notes",
        priority: 7
      },
      {
        type: "topic",
        title: "Practice past papers",
        description: "Regular timed practice with real exam questions",
        priority: 9
      }
    ];
  }

  private getFallbackStudyPlan(): string {
    return `
• Start with your weakest subject (15-20 minutes)
• Review key formulas and concepts (10 minutes)
• Practice 5-8 questions (15 minutes)
• Quick review of strongest subject (10 minutes)
• End with flashcard review (5 minutes)
    `;
  }
}

export const aiAssistant = new AIStudyAssistant();