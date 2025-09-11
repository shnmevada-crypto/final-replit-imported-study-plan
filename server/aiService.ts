import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

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
  
  async generatePersonalizedTip(xpData: any): Promise<AIStudyTip> {
    try {
      console.log('Generating personalized tip for XP data:', xpData);
      
      const prompt = `
        Based on this GCSE student's XP levels: ${JSON.stringify(xpData)}, 
        provide a personalized study tip. Focus on their weakest subject or suggest 
        optimization strategies for their strongest subjects.
        
        Respond with JSON in this format:
        {
          "title": "Brief motivating title",
          "content": "Specific, actionable study advice (2-3 sentences)",
          "priority": "high|medium|low",
          "subjects": ["relevant subject names"],
          "estimatedTime": "time estimate like '15 minutes' or '30 minutes'"
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are an expert GCSE study advisor. Provide practical, evidence-based study tips that are specific and actionable for students."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 300
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        title: result.title || "Keep studying!",
        content: result.content || "Continue your excellent progress across all subjects.",
        priority: result.priority || 'medium',
        subjects: result.subjects || [],
        estimatedTime: result.estimatedTime || "15 minutes"
      };
    } catch (error) {
      console.error('AI Tip Generation Error:', error);
      return this.getFallbackTip(xpData);
    }
  }

  async generateSmartQuests(xpData: any, completedQuests: any[]): Promise<AIQuest[]> {
    try {
      console.log('Generating quests for XP data:', xpData);
      
      const prompt = `
        Generate 3 personalized daily study quests for a GCSE student with XP levels: ${JSON.stringify(xpData)}.
        Consider their strengths and weaknesses. Recent completed quests: ${JSON.stringify(completedQuests.slice(-5))}.
        
        Focus on varied activities: practice problems, revision, reading, videos, etc.
        
        Respond with JSON in this format:
        {
          "quests": [
            {
              "title": "Quest title",
              "description": "Detailed description of what to do",
              "xp": 15-40,
              "subject": "subject name",
              "difficulty": "Easy|Medium|Hard",
              "estimatedTime": "time estimate"
            }
          ]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are a GCSE study planner. Create engaging, specific, and achievable daily study quests that help students improve systematically."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 600
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.quests || this.getFallbackQuests();
    } catch (error) {
      console.error('AI Quest Generation Error:', error);
      return this.getFallbackQuests();
    }
  }

  async getResourceRecommendations(xpData: any, currentSubject?: string): Promise<AIRecommendation[]> {
    try {
      console.log('Generating recommendations for XP data:', xpData, 'subject:', currentSubject);
      
      const prompt = `
        Based on XP levels ${JSON.stringify(xpData)} ${currentSubject ? `and current focus on ${currentSubject}` : ''}, 
        recommend 3 specific study strategies or focus areas for GCSE students.
        
        Respond with JSON in this format:
        {
          "recommendations": [
            {
              "type": "resource|topic|practice",
              "title": "Recommendation title",
              "description": "Why this helps and what to do",
              "priority": 1-10
            }
          ]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are a GCSE education specialist. Provide targeted recommendations that address specific subject weaknesses and build on strengths."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 400
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.recommendations || this.getFallbackRecommendations();
    } catch (error) {
      console.error('AI Recommendation Error:', error);
      return this.getFallbackRecommendations();
    }
  }

  // Fallback methods for when AI is unavailable
  private getFallbackTip(xpData: any): AIStudyTip {
    const subjects = Object.entries(xpData).sort((a: any, b: any) => a[1] - b[1]);
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

  async generateStudyPlan(xpData: any, timeAvailable: string): Promise<string> {
    try {
      console.log('Generating study plan for XP data:', xpData, 'time:', timeAvailable);
      
      const prompt = `
        Create a personalized study plan for a GCSE student with XP levels: ${JSON.stringify(xpData)}.
        They have ${timeAvailable} available for study today.
        
        Focus on their weakest subjects while maintaining strong ones. Provide a practical, time-specific plan.
        
        Respond with a simple bulleted list format (no JSON needed).
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are a GCSE study planner. Create practical, time-efficient study plans that help students maximize their learning."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 400
      });

      return response.choices[0].message.content || this.getFallbackStudyPlan();
    } catch (error) {
      console.error('AI Study Plan Error:', error);
      return this.getFallbackStudyPlan();
    }
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