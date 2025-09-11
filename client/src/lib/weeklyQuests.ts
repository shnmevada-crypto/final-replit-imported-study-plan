// Weekly quest generation utilities with date-dependent functionality

export interface WeeklyQuest {
  id: number;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  subject: string;
  topics: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  weekNumber: number;
  year: number;
  resources: string[];
  tips: string[];
  requirements: string[];
}

// Get current week number and year
export function getCurrentWeek(): { weekNumber: number; year: number } {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
  return { weekNumber, year: now.getFullYear() };
}

// GCSE curriculum-aligned weekly quest templates
const WEEKLY_QUEST_TEMPLATES = [
  // Week 1-8: Foundation Building
  {
    weeks: [1, 2, 3, 4, 5, 6, 7, 8],
    quests: [
      {
        subject: 'Maths',
        title: 'Master Algebraic Fundamentals (Edexcel)',
        description: 'Complete comprehensive practice on algebraic expressions, equations, and basic graph interpretation aligned with Edexcel GCSE Mathematics',
        topics: ['Algebraic expressions', 'Linear equations', 'Coordinate geometry', 'Quadratic equations'],
        difficulty: 'Medium' as const,
        xp: 100,
        estimatedTime: '4-5 hours',
        resources: ['Edexcel GCSE Mathematics Pearson textbook', 'Corbettmaths videos', 'Mathsgenie practice papers'],
        tips: ['Start with simple equations', 'Use BIDMAS for order of operations', 'Practice substitution with negative numbers', 'Draw coordinate grids carefully'],
        requirements: ['Complete 25 algebraic problems from Edexcel past papers', 'Solve 8 linear equations', 'Plot 5 coordinate graphs with negative values', 'Practice 3 quadratic factorisation']
      },
      {
        subject: 'EnglishLanguage',
        title: 'Creative Writing Excellence (AQA Paper 1)',
        description: 'Master descriptive and narrative writing techniques for AQA English Language Paper 1, focusing on engaging openings and vivid descriptions',
        topics: ['Descriptive writing', 'Narrative structure', 'Character development', 'Setting description', 'Dialogue techniques'],
        difficulty: 'Medium' as const,
        xp: 80,
        estimatedTime: '3-4 hours',
        resources: ['AQA English Language Paper 1 past papers', 'Mr Bruff YouTube channel', 'AQA writing exemplars'],
        tips: ['Start with powerful opening sentences', 'Use all 5 senses in descriptions', 'Vary sentence lengths for rhythm', 'Show character through actions and dialogue'],
        requirements: ['Write 2 descriptive pieces (150 words each)', 'Create 3 engaging story openings', 'Practice dialogue punctuation', 'Complete timed writing exercise (45 mins)']
      },
    ]
  },
  // Week 9-16: Intermediate Development
  {
    weeks: [9, 10, 11, 12, 13, 14, 15, 16],
    quests: [
      {
        subject: 'Chemistry',
        title: 'Chemical Reactions Deep Dive',
        description: 'Explore different types of chemical reactions, balancing equations, and reaction mechanisms',
        topics: ['Chemical equations', 'Reaction types', 'Conservation of mass'],
        difficulty: 'Hard' as const,
        xp: 120,
        estimatedTime: '5-6 hours',
        resources: ['Combined Science AQA textbook', 'Save My Exams Chemistry notes'],
        tips: ['Balance equations systematically', 'Learn common ion formulas', 'Practice with past papers'],
        requirements: ['Balance 25 equations', 'Identify 10 reaction types', 'Complete mass calculations']
      },
      {
        subject: 'Biology',
        title: 'Cell Biology Specialist',
        description: 'Master cellular processes, mitosis, and genetic fundamentals for GCSE success',
        topics: ['Cell structure', 'Mitosis', 'DNA', 'Genetic inheritance'],
        difficulty: 'Medium' as const,
        xp: 95,
        estimatedTime: '4-5 hours',
        resources: ['AQA Biology textbook Ch. 2-4', 'Interactive cell diagrams'],
        tips: ['Use mnemonics for cell parts', 'Draw detailed diagrams', 'Practice genetic crosses'],
        requirements: ['Label cell diagrams', 'Explain mitosis stages', 'Complete genetics problems']
      },
      {
        subject: 'French',
        title: 'Conversational French Excellence (AQA)',
        description: 'Develop speaking and listening skills for AQA GCSE French with focus on assessment objectives and common conversation topics',
        topics: ['Family and relationships', 'Daily routine', 'Food and drink', 'Local environment', 'Future plans'],
        difficulty: 'Medium' as const,
        xp: 85,
        estimatedTime: '4 hours',
        resources: ['AQA French speaking photo cards', 'Role-play scenarios', 'Authentic French audio materials'],
        tips: ['Practice with AQA assessment criteria', 'Record yourself for self-assessment', 'Learn key phrases with correct pronunciation', 'Use opinion phrases with justification'],
        requirements: ['Record 5 speaking exercises using AQA format', 'Learn 50 topic-specific vocabulary words', 'Practice conversation topics with time limits']
      }
    ]
  },
  // Week 17-24: Advanced Application
  {
    weeks: [17, 18, 19, 20, 21, 22, 23, 24],
    quests: [
      {
        subject: 'Business',
        title: 'Entrepreneurship Project (AQA)',
        description: 'Design a complete business plan for AQA GCSE Business incorporating marketing mix, financial analysis, and operational strategies',
        topics: ['Business planning', 'Marketing mix (4Ps)', 'Financial forecasting', 'Operations management', 'Stakeholder analysis'],
        difficulty: 'Hard' as const,
        xp: 150,
        estimatedTime: '6-7 hours',
        resources: ['AQA Business Studies specification', 'Case study examples', 'Financial calculation worksheets', 'Business plan templates'],
        tips: ['Use AQA command words correctly', 'Apply business theory to real examples', 'Show clear chains of reasoning', 'Include quantitative and qualitative analysis'],
        requirements: ['Complete detailed business plan with AQA marking criteria', 'Calculate break-even and cash flow', 'Analyze stakeholder impact', 'Present recommendations']
      },
      {
        subject: 'ComputerScience',
        title: 'Programming Mastery Challenge (AQA)',
        description: 'Master AQA GCSE Computer Science programming requirements through algorithm implementation and computational thinking',
        topics: ['Algorithms', 'Data structures', 'Programming constructs', 'Testing and debugging', 'Problem decomposition'],
        difficulty: 'Hard' as const,
        xp: 130,
        estimatedTime: '5-6 hours',
        resources: ['AQA Computer Science Programming Guide', 'Python/pseudocode examples', 'Algorithm trace tables', 'Programming challenges'],
        tips: ['Use AQA pseudocode conventions', 'Practice trace tables for algorithms', 'Learn both Python and pseudocode formats', 'Focus on efficiency and readability'],
        requirements: ['Write 3 programs using AQA assessment criteria', 'Complete algorithm trace exercises', 'Solve computational thinking problems', 'Debug provided code snippets']
      },
      {
        subject: 'PE',
        title: 'Sports Performance Analysis (AQA)',
        description: 'Apply AQA GCSE PE scientific principles to analyze athletic performance, training methods, and biomechanical factors',
        topics: ['Training principles (FITT)', 'Sports psychology factors', 'Biomechanical analysis', 'Injury prevention', 'Fitness components'],
        difficulty: 'Medium' as const,
        xp: 75,
        estimatedTime: '3-4 hours',
        resources: ['AQA PE specification and past papers', 'Sports analysis videos', 'Training principle worksheets', 'Biomechanics diagrams'],
        tips: ['Link theory to practical examples', 'Use AQA key terminology correctly', 'Apply FITT principles systematically', 'Consider both physical and psychological factors'],
        requirements: ['Design periodised training program using AQA criteria', 'Complete biomechanical movement analysis', 'Evaluate fitness testing methods', 'Apply injury prevention strategies']
      }
    ]
  }
];

// Generate weekly quests based on current week
export function generateWeeklyQuests(): WeeklyQuest[] {
  const { weekNumber, year } = getCurrentWeek();
  
  // Find appropriate template for current week
  const template = WEEKLY_QUEST_TEMPLATES.find(t => t.weeks.includes(weekNumber)) || WEEKLY_QUEST_TEMPLATES[0];
  
  // Generate quests with unique IDs based on week and year
  return template.quests.map((quest, index) => ({
    id: weekNumber * 1000 + year + index, // Unique ID based on week/year
    ...quest,
    completed: false,
    weekNumber,
    year
  }));
}

// Check if weekly quests need refresh (new week)
export function shouldRefreshWeeklyQuests(lastWeek: number, lastYear: number): boolean {
  const { weekNumber, year } = getCurrentWeek();
  return weekNumber !== lastWeek || year !== lastYear;
}