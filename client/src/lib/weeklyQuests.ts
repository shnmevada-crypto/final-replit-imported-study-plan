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
        subject: 'Mathematics',
        title: 'Master Algebraic Fundamentals',
        description: 'Complete comprehensive practice on algebraic expressions, equations, and basic graph interpretation',
        topics: ['Algebraic expressions', 'Linear equations', 'Coordinate geometry'],
        difficulty: 'Medium' as const,
        xp: 100,
        estimatedTime: '4-5 hours',
        resources: ['Edexcel GCSE Mathematics textbook Ch. 1-3', 'BBC Bitesize Algebra'],
        tips: ['Start with simple equations', 'Practice substitution daily', 'Use visual aids for graphs'],
        requirements: ['Complete 20 algebraic problems', 'Solve 5 linear equations', 'Plot 3 coordinate graphs']
      },
      {
        subject: 'English Language',
        title: 'Creative Writing Mastery',
        description: 'Develop descriptive writing skills with focus on narrative techniques and character development',
        topics: ['Descriptive writing', 'Narrative structure', 'Character development'],
        difficulty: 'Medium' as const,
        xp: 80,
        estimatedTime: '3-4 hours',
        resources: ['AQA English Language Paper 1 examples', 'Writing techniques guide'],
        tips: ['Use sensory details', 'Show don\'t tell', 'Vary sentence structure'],
        requirements: ['Write 2 descriptive pieces', 'Practice dialogue writing', 'Complete character profiles']
      },
      {
        subject: 'Physics',
        title: 'Forces and Motion Foundations',
        description: 'Build understanding of fundamental physics concepts including Newton\'s laws and motion calculations',
        topics: ['Forces', 'Motion', 'Velocity', 'Acceleration'],
        difficulty: 'Medium' as const,
        xp: 90,
        estimatedTime: '4 hours',
        resources: ['AQA GCSE Physics textbook Ch. 5', 'Physics & Maths Tutor worksheets'],
        tips: ['Draw force diagrams', 'Practice unit conversions', 'Use real-world examples'],
        requirements: ['Solve 15 motion problems', 'Draw 5 force diagrams', 'Complete velocity calculations']
      }
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
        title: 'Conversational French Excellence',
        description: 'Develop speaking and listening skills with focus on common GCSE conversation topics',
        topics: ['Family and relationships', 'Daily routine', 'Food and drink'],
        difficulty: 'Medium' as const,
        xp: 85,
        estimatedTime: '4 hours',
        resources: ['AQA French speaking cards', 'Language learning apps', 'Audio resources'],
        tips: ['Practice pronunciation daily', 'Record yourself speaking', 'Learn key phrases by heart'],
        requirements: ['Record 5 speaking exercises', 'Learn 50 new vocabulary words', 'Practice conversation topics']
      }
    ]
  },
  // Week 17-24: Advanced Application
  {
    weeks: [17, 18, 19, 20, 21, 22, 23, 24],
    quests: [
      {
        subject: 'Business Studies',
        title: 'Entrepreneurship Project',
        description: 'Design a complete business plan incorporating marketing, finance, and operational strategies',
        topics: ['Business planning', 'Marketing mix', 'Financial planning', 'Operations'],
        difficulty: 'Hard' as const,
        xp: 150,
        estimatedTime: '6-7 hours',
        resources: ['AQA Business Studies textbook', 'Real business case studies', 'Financial planning templates'],
        tips: ['Research real businesses', 'Use SWOT analysis', 'Include realistic financial projections'],
        requirements: ['Complete business plan', 'Design marketing strategy', 'Create financial forecasts']
      },
      {
        subject: 'Computer Science',
        title: 'Programming Mastery Challenge',
        description: 'Develop algorithmic thinking through practical programming projects and problem-solving',
        topics: ['Algorithms', 'Data structures', 'Programming logic', 'Testing'],
        difficulty: 'Hard' as const,
        xp: 130,
        estimatedTime: '5-6 hours',
        resources: ['AQA Computer Science textbook', 'Programming environments', 'Algorithm visualizations'],
        tips: ['Plan before coding', 'Test thoroughly', 'Comment your code clearly'],
        requirements: ['Write 3 programs', 'Solve algorithm challenges', 'Complete debugging exercises']
      },
      {
        subject: 'Physical Education',
        title: 'Sports Performance Analysis',
        description: 'Analyze athletic performance using scientific principles of training and biomechanics',
        topics: ['Training principles', 'Sports psychology', 'Biomechanics', 'Performance analysis'],
        difficulty: 'Medium' as const,
        xp: 75,
        estimatedTime: '3-4 hours',
        resources: ['AQA PE textbook', 'Performance analysis videos', 'Training plan templates'],
        tips: ['Use real sports examples', 'Apply FITT principles', 'Consider individual differences'],
        requirements: ['Design training program', 'Analyze movement patterns', 'Complete fitness assessments']
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