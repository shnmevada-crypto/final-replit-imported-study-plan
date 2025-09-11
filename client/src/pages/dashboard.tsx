import { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Lightbulb, ChartBar, Flame, CheckSquare, ExternalLink, Archive, Eye, Download, BookOpen, FileText, Atom, Bot, Sparkles, Target, Info, Calendar, Clock, MapPin } from 'lucide-react';
import { aiAssistant, type AIStudyTip, type AIQuest, type AIRecommendation } from '@/lib/aiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { WeeklyQuestSection } from '@/components/WeeklyQuestSection';
import { generateWeeklyQuests, shouldRefreshWeeklyQuests, getCurrentWeek, type WeeklyQuest } from '@/lib/weeklyQuests';
import type { AppState, PastPaper } from '@shared/schema';

const DEFAULT_STATE: AppState = {
  xp: {
    Math: 120,
    Physics: 85,
    Chemistry: 90,
    Biology: 75,
    History: 50,
  },
  pastPapers: [
    // AQA Mathematics Past Papers
    { id: 1, title: 'Mathematics Paper 1 (Higher Tier - June 2023)', subject: 'Math', difficulty: 'Hard', board: 'AQA', year: 2023, season: 'May/June', paperNumber: '1H', topics: ['Algebra', 'Number', 'Geometry'], curriculumCode: 'AQA-8300-1H', url: 'https://www.aqa.org.uk/resources/mathematics/gcse/mathematics/past-papers-and-mark-schemes', downloadUrl: 'https://filestore.aqa.org.uk/resources/mathematics/AQA-83001H-QP-JUN23.PDF', markSchemeUrl: 'https://filestore.aqa.org.uk/resources/mathematics/AQA-83001H-W-MS-JUN23.PDF' },
    { id: 2, title: 'Mathematics Paper 2 (Higher Tier - June 2023)', subject: 'Math', difficulty: 'Hard', board: 'AQA', year: 2023, season: 'May/June', paperNumber: '2H', topics: ['Statistics', 'Probability', 'Ratio'], curriculumCode: 'AQA-8300-2H', url: 'https://www.aqa.org.uk/resources/mathematics/gcse/mathematics/past-papers-and-mark-schemes', downloadUrl: 'https://filestore.aqa.org.uk/resources/mathematics/AQA-83002H-QP-JUN23.PDF', markSchemeUrl: 'https://filestore.aqa.org.uk/resources/mathematics/AQA-83002H-W-MS-JUN23.PDF' },
    { id: 3, title: 'Mathematics Paper 3 (Higher Tier - June 2023)', subject: 'Math', difficulty: 'Hard', board: 'AQA', year: 2023, season: 'May/June', paperNumber: '3H', topics: ['Geometry', 'Trigonometry', 'Calculus'], curriculumCode: 'AQA-8300-3H', url: 'https://www.aqa.org.uk/resources/mathematics/gcse/mathematics/past-papers-and-mark-schemes', downloadUrl: 'https://filestore.aqa.org.uk/resources/mathematics/AQA-83003H-QP-JUN23.PDF', markSchemeUrl: 'https://filestore.aqa.org.uk/resources/mathematics/AQA-83003H-W-MS-JUN23.PDF' },

    // AQA Physics Past Papers  
    { id: 4, title: 'Physics Paper 1 (Higher Tier - June 2023)', subject: 'Physics', difficulty: 'Hard', board: 'AQA', year: 2023, season: 'May/June', paperNumber: '1H', topics: ['Energy', 'Electricity', 'Particle Model'], curriculumCode: 'AQA-8463-1H', url: 'https://www.aqa.org.uk/resources/physics/gcse/physics/past-papers-and-mark-schemes', downloadUrl: 'https://filestore.aqa.org.uk/resources/physics/AQA-84631H-QP-JUN23.PDF', markSchemeUrl: 'https://filestore.aqa.org.uk/resources/physics/AQA-84631H-W-MS-JUN23.PDF' },
    { id: 5, title: 'Physics Paper 2 (Higher Tier - June 2023)', subject: 'Physics', difficulty: 'Hard', board: 'AQA', year: 2023, season: 'May/June', paperNumber: '2H', topics: ['Forces', 'Waves', 'Magnetism'], curriculumCode: 'AQA-8463-2H', url: 'https://www.aqa.org.uk/resources/physics/gcse/physics/past-papers-and-mark-schemes', downloadUrl: 'https://filestore.aqa.org.uk/resources/physics/AQA-84632H-QP-JUN23.PDF', markSchemeUrl: 'https://filestore.aqa.org.uk/resources/physics/AQA-84632H-W-MS-JUN23.PDF' },

    // AQA Chemistry Past Papers
    { id: 6, title: 'Chemistry Paper 1 (Higher Tier - June 2023)', subject: 'Chemistry', difficulty: 'Hard', board: 'AQA', year: 2023, season: 'May/June', paperNumber: '1H', topics: ['Atomic Structure', 'Bonding', 'Quantitative Chemistry'], curriculumCode: 'AQA-8462-1H', url: 'https://www.aqa.org.uk/resources/chemistry/gcse/chemistry/past-papers-and-mark-schemes', downloadUrl: 'https://filestore.aqa.org.uk/resources/chemistry/AQA-84621H-QP-JUN23.PDF', markSchemeUrl: 'https://filestore.aqa.org.uk/resources/chemistry/AQA-84621H-W-MS-JUN23.PDF' },
    { id: 7, title: 'Chemistry Paper 2 (Higher Tier - June 2023)', subject: 'Chemistry', difficulty: 'Hard', board: 'AQA', year: 2023, season: 'May/June', paperNumber: '2H', topics: ['Chemical Changes', 'Energy Changes', 'Rate and Extent'], curriculumCode: 'AQA-8462-2H', url: 'https://www.aqa.org.uk/resources/chemistry/gcse/chemistry/past-papers-and-mark-schemes', downloadUrl: 'https://filestore.aqa.org.uk/resources/chemistry/AQA-84622H-QP-JUN23.PDF', markSchemeUrl: 'https://filestore.aqa.org.uk/resources/chemistry/AQA-84622H-W-MS-JUN23.PDF' },

    // AQA Biology Past Papers
    { id: 8, title: 'Biology Paper 1 (Higher Tier - June 2023)', subject: 'Biology', difficulty: 'Hard', board: 'AQA', year: 2023, season: 'May/June', paperNumber: '1H', topics: ['Cell Biology', 'Organisation', 'Infection and Response'], curriculumCode: 'AQA-8461-1H', url: 'https://www.aqa.org.uk/resources/biology/gcse/biology/past-papers-and-mark-schemes', downloadUrl: 'https://filestore.aqa.org.uk/resources/biology/AQA-84611H-QP-JUN23.PDF', markSchemeUrl: 'https://filestore.aqa.org.uk/resources/biology/AQA-84611H-W-MS-JUN23.PDF' },
    { id: 9, title: 'Biology Paper 2 (Higher Tier - June 2023)', subject: 'Biology', difficulty: 'Hard', board: 'AQA', year: 2023, season: 'May/June', paperNumber: '2H', topics: ['Bioenergetics', 'Homeostasis', 'Inheritance'], curriculumCode: 'AQA-8461-2H', url: 'https://www.aqa.org.uk/resources/biology/gcse/biology/past-papers-and-mark-schemes', downloadUrl: 'https://filestore.aqa.org.uk/resources/biology/AQA-84612H-QP-JUN23.PDF', markSchemeUrl: 'https://filestore.aqa.org.uk/resources/biology/AQA-84612H-W-MS-JUN23.PDF' },

    // Edexcel Mathematics Past Papers
    { id: 10, title: 'Mathematics Paper 1 (Higher Tier - June 2023)', subject: 'Math', difficulty: 'Hard', board: 'Edexcel', year: 2023, season: 'May/June', paperNumber: '1H', topics: ['Number', 'Algebra', 'Geometry'], curriculumCode: 'EDEXCEL-1MA1-1H', url: 'https://qualifications.pearson.com/en/qualifications/edexcel-gcses/mathematics-2015.html', downloadUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/mathematics/2015/exam-materials/1MA1_1H_que_20230524.pdf', markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/mathematics/2015/exam-materials/1MA1_1H_msc_20230524.pdf' },

    // OCR Computer Science Past Papers
    { id: 11, title: 'Computer Science J277/01 (June 2023)', subject: 'Computer Science', difficulty: 'Medium', board: 'OCR', year: 2023, season: 'May/June', paperNumber: '01', topics: ['Computer Systems', 'Computational Thinking', 'Algorithms'], curriculumCode: 'OCR-J277-01', url: 'https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/', downloadUrl: 'https://www.ocr.org.uk/Images/558027-question-paper-computer-systems-j277-01-advanced-information.pdf', markSchemeUrl: 'https://www.ocr.org.uk/Images/558028-mark-scheme-computer-systems-j277-01-advanced-information.pdf' },
    { id: 12, title: 'Computer Science J277/02 (June 2023)', subject: 'Computer Science', difficulty: 'Hard', board: 'OCR', year: 2023, season: 'May/June', paperNumber: '02', topics: ['Computational Thinking', 'Algorithms', 'Programming'], curriculumCode: 'OCR-J277-02', url: 'https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/', downloadUrl: 'https://www.ocr.org.uk/Images/558030-question-paper-computational-thinking-algorithms-and-programming-j277-02.pdf', markSchemeUrl: 'https://www.ocr.org.uk/Images/558031-mark-scheme-computational-thinking-algorithms-and-programming-j277-02.pdf' },

    // AQA English Literature Past Papers
    { id: 13, title: 'English Literature Paper 1 (June 2023)', subject: 'English', difficulty: 'Medium', board: 'AQA', year: 2023, season: 'May/June', paperNumber: '1', topics: ['Shakespeare', 'Victorian Novel'], curriculumCode: 'AQA-8702-1', url: 'https://www.aqa.org.uk/resources/english/gcse/english-literature/past-papers-and-mark-schemes', downloadUrl: 'https://filestore.aqa.org.uk/resources/english/AQA-87021-QP-JUN23.PDF', markSchemeUrl: 'https://filestore.aqa.org.uk/resources/english/AQA-87021-W-MS-JUN23.PDF' },
    { id: 14, title: 'English Literature Paper 2 (June 2023)', subject: 'English', difficulty: 'Medium', board: 'AQA', year: 2023, season: 'May/June', paperNumber: '2', topics: ['Modern Drama', 'Poetry', 'Unseen Poetry'], curriculumCode: 'AQA-8702-2', url: 'https://www.aqa.org.uk/resources/english/gcse/english-literature/past-papers-and-mark-schemes', downloadUrl: 'https://filestore.aqa.org.uk/resources/english/AQA-87022-QP-JUN23.PDF', markSchemeUrl: 'https://filestore.aqa.org.uk/resources/english/AQA-87022-W-MS-JUN23.PDF' },

    // Edexcel History Past Papers
    { id: 15, title: 'History Paper 1 - Medicine Through Time (June 2023)', subject: 'History', difficulty: 'Hard', board: 'Edexcel', year: 2023, season: 'May/June', paperNumber: '1', topics: ['Medicine Through Time', 'Historic Environment'], curriculumCode: 'EDEXCEL-1HI0-10', url: 'https://qualifications.pearson.com/en/qualifications/edexcel-gcses/history-2016.html', downloadUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/History/2016/exam-materials/1HI0_10_que_20230524.pdf', markSchemeUrl: 'https://qualifications.pearson.com/content/dam/pdf/GCSE/History/2016/exam-materials/1HI0_10_msc_20230524.pdf' }
  ],
  quests: [
    { id: 1, title: 'Complete a practice quiz', xp: 25, completed: false },
    { id: 2, title: 'Review flashcards for 15 minutes', xp: 20, completed: false },
    { id: 3, title: 'Solve 10 practice problems', xp: 30, completed: true },
    { id: 4, title: 'Read study notes for 30 minutes', xp: 25, completed: true },
    { id: 5, title: 'Watch educational video', xp: 15, completed: false },
  ],
  settings: {
    xpMultiplier: 1.5
  },
  studyStreak: [1, 2, 5, 8, 10, 11, 15, 16, 17, 20],
  resources: []
};

const COMPREHENSIVE_RESOURCES = [
  // Core GCSE Resources
  { name: 'BBC Bitesize', url: 'https://www.bbc.co.uk/bitesize', icon: FileText, category: 'General', subjects: ['All'], description: 'Official BBC educational content for all GCSE subjects' },
  { name: 'Save My Exams', url: 'https://www.savemyexams.com/', icon: FileText, category: 'Past Papers', subjects: ['All'], description: 'Comprehensive past papers and mark schemes' },
  { name: 'Seneca Learning', url: 'https://senecalearning.com/', icon: BookOpen, category: 'Interactive', subjects: ['All'], description: 'Interactive revision courses for all subjects' },
  
  // Mathematics Resources
  { name: 'Maths Genie', url: 'https://www.mathsgenie.co.uk/', icon: Atom, category: 'Subject Specific', subjects: ['Math'], description: 'Complete GCSE mathematics revision and past papers' },
  { name: 'Corbettmaths', url: 'https://corbettmaths.com/', icon: Atom, category: 'Subject Specific', subjects: ['Math'], description: 'Video tutorials and practice questions for mathematics' },
  { name: 'TLMaths', url: 'https://tlmaths.com/', icon: Atom, category: 'Subject Specific', subjects: ['Math'], description: 'Mathematics tutorials and exam techniques' },
  { name: 'Khan Academy Math', url: 'https://www.khanacademy.org/math', icon: BookOpen, category: 'Subject Specific', subjects: ['Math'], description: 'World-class mathematics education' },
  
  // Science Resources
  { name: 'Physics & Maths Tutor', url: 'https://www.physicsandmathstutor.com/', icon: Atom, category: 'Subject Specific', subjects: ['Physics', 'Math', 'Chemistry'], description: 'STEM revision materials and past papers' },
  { name: 'Cognito', url: 'https://cognitoedu.org/', icon: FileText, category: 'Video Tutorials', subjects: ['Physics', 'Chemistry', 'Biology'], description: 'Animated video tutorials for science subjects' },
  { name: 'Free Science Lessons', url: 'https://www.freesciencelessons.co.uk/', icon: FileText, category: 'Video Tutorials', subjects: ['Physics', 'Chemistry', 'Biology'], description: 'Complete GCSE science video courses' },
  
  // English Resources
  { name: 'Mr Salles', url: 'https://www.youtube.com/@MrSallesTeachesEnglish', icon: BookOpen, category: 'Subject Specific', subjects: ['English'], description: 'English Literature analysis and exam techniques' },
  { name: 'Mr Bruff', url: 'https://www.youtube.com/@mrbruff', icon: BookOpen, category: 'Subject Specific', subjects: ['English'], description: 'English Language and Literature tutorials' },
  
  // Computer Science
  { name: 'Craig \'n\' Dave', url: 'https://www.craigndave.org/', icon: Atom, category: 'Subject Specific', subjects: ['Computer Science'], description: 'Complete GCSE Computer Science course' },
  
  // Study Tools
  { name: 'Quizlet', url: 'https://quizlet.com/', icon: BookOpen, category: 'Study Tools', subjects: ['All'], description: 'Flashcards and study sets for all subjects' },
  { name: 'Gojimo', url: 'https://www.gojimo.com/', icon: FileText, category: 'Mobile Learning', subjects: ['All'], description: 'Mobile learning app with practice questions' },
  { name: 'Tes Resources', url: 'https://www.tes.com/teaching-resources', icon: FileText, category: 'Teaching Resources', subjects: ['All'], description: 'Teacher-created resources and worksheets' },
  
  // Additional Subject-Specific Resources
  { name: 'AQA GCSE Resources', url: 'https://www.aqa.org.uk/subjects/geography/gcse', icon: FileText, category: 'Exam Board', subjects: ['All'], description: 'Official AQA exam board resources' },
  { name: 'Edexcel Resources', url: 'https://qualifications.pearson.com/en/qualifications/edexcel-gcses.html', icon: FileText, category: 'Exam Board', subjects: ['All'], description: 'Official Edexcel exam board materials' },
  { name: 'OCR Resources', url: 'https://www.ocr.org.uk/qualifications/gcse/', icon: FileText, category: 'Exam Board', subjects: ['All'], description: 'Official OCR exam board content' },
  
  // Additional Learning Platforms
  { name: 'MyMaths', url: 'https://www.mymaths.co.uk/', icon: Atom, category: 'Subject Specific', subjects: ['Math'], description: 'Interactive mathematics learning platform' },
  { name: 'GCSEPod', url: 'https://www.gcsepod.com/', icon: FileText, category: 'Video Tutorials', subjects: ['All'], description: 'Audio-visual learning pods for all subjects' }
];

function XPBar({ subject, xp, max }: { subject: string; xp: number; max: number }) {
  const percentage = (xp / max) * 100;
  
  return (
    <div className="text-center w-16" data-testid={`xp-bar-${subject.toLowerCase()}`}>
      <div className="h-32 flex items-end">
        <div
          style={{ height: `${percentage}%` }}
          className="w-full rounded-t-lg transition-all duration-300 hover:scale-105"
        >
          <div className="h-full rounded-t-lg xp-bar-gradient shadow-lg" />
        </div>
      </div>
      <div className="text-xs mt-2 font-medium">{subject}</div>
      <div className="text-xs text-muted-foreground">{xp} XP</div>
    </div>
  );
}

function MiniCalendar({ highlighted = [] }: { highlighted: number[] }) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  
  return (
    <div className="grid grid-cols-7 gap-1 text-xs">
      {days.map((day) => (
        <div
          key={day}
          className={`calendar-day p-2 rounded text-center ${
            highlighted.includes(day) 
              ? 'bg-primary/20 border border-primary/30' 
              : ''
          }`}
          data-testid={`calendar-day-${day}`}
        >
          {day}
        </div>
      ))}
    </div>
  );
}

function PaperInfoModal({ paper, isOpen, onClose }: { paper: PastPaper | null; isOpen: boolean; onClose: () => void; }) {
  if (!paper) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-start gap-3">
            <Info className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h2 className="text-lg font-bold">{paper.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{paper.subject}</Badge>
                <Badge variant="outline">{paper.board}</Badge>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getDifficultyColor(paper.difficulty)}`} />
                  <span className="text-sm text-muted-foreground">{paper.difficulty}</span>
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Paper Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Exam Details</span>
              </div>
              <div className="text-sm space-y-1 ml-6">
                <p>Year: <span className="font-medium">{paper.year}</span></p>
                <p>Season: <span className="font-medium">{paper.season}</span></p>
                <p>Paper: <span className="font-medium">{paper.paperNumber}</span></p>
                <p>Code: <span className="font-medium font-mono text-xs">{paper.curriculumCode}</span></p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Topics Covered</span>
              </div>
              <div className="flex flex-wrap gap-1 ml-6">
                {paper.topics?.map((topic, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {topic}
                  </Badge>
                )) || <span className="text-sm text-muted-foreground">No topics available</span>}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Available Resources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                className="flex-1 quest-button-gradient text-white hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => window.open(paper.downloadUrl, '_blank')}
                data-testid={`modal-download-paper-${paper.id}`}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Paper
              </Button>
              
              {paper.markSchemeUrl && (
                <Button
                  variant="secondary" 
                  className="flex-1 hover:scale-105 transition-all duration-200"
                  onClick={() => window.open(paper.markSchemeUrl, '_blank')}
                  data-testid={`modal-download-markscheme-${paper.id}`}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Mark Scheme
                </Button>
              )}
              
              <Button
                variant="outline"
                className="flex-1 hover:scale-105 transition-all duration-200"
                onClick={() => window.open(paper.url, '_blank')}
                data-testid={`modal-preview-paper-${paper.id}`}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Dashboard() {
  const [state, setState] = useLocalStorage('solo_leveling_state', DEFAULT_STATE);
  
  // Weekly quest state management
  const [weeklyQuests, setWeeklyQuests] = useLocalStorage('weekly_quests', [] as WeeklyQuest[]);
  const [lastWeeklyUpdate, setLastWeeklyUpdate] = useLocalStorage('last_weekly_update', { weekNumber: 0, year: 0 });
  
  // Initialize or refresh weekly quests based on current week
  useEffect(() => {
    const { weekNumber, year } = getCurrentWeek();
    if (shouldRefreshWeeklyQuests(lastWeeklyUpdate.weekNumber, lastWeeklyUpdate.year)) {
      const newWeeklyQuests = generateWeeklyQuests();
      setWeeklyQuests(newWeeklyQuests);
      setLastWeeklyUpdate({ weekNumber, year });
    }
  }, []);

  const [filter, setFilter] = useState({
    subject: 'All',
    difficulty: 'All',
    board: 'All'
  });
  const [resourceFilter, setResourceFilter] = useState({
    category: 'All',
    subject: 'All'
  });
  const [selectedPaper, setSelectedPaper] = useState<PastPaper | null>(null);
  const [isPaperInfoOpen, setIsPaperInfoOpen] = useState(false);
  const [aiStudyTip, setAiStudyTip] = useState<AIStudyTip | null>(null);
  const [aiQuests, setAiQuests] = useState<AIQuest[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isGeneratingQuests, setIsGeneratingQuests] = useState(false);

  const subjects = useMemo(() => Object.keys(state.xp) as (keyof typeof state.xp)[], [state.xp]);
  const totalXP = useMemo(() => Object.values(state.xp).reduce((a, b) => a + b, 0), [state.xp]);
  const maxXP = useMemo(() => Math.max(...Object.values(state.xp)), [state.xp]);

  const fallbackTip = useMemo(() => {
    const items = Object.entries(state.xp).sort((a, b) => a[1] - b[1]);
    const weakest = items[0][0];
    return `Focus on ${weakest}: try 20 minutes of active recall and 3 targeted practice questions.`;
  }, [state.xp]);

  const filteredPapers = state.pastPapers.filter((paper) => 
    (filter.subject === 'All' || paper.subject === filter.subject) &&
    (filter.difficulty === 'All' || paper.difficulty === filter.difficulty) &&
    (filter.board === 'All' || paper.board === filter.board)
  );

  const completedQuests = state.quests.filter(q => q.completed).length;

  // AI functionality
  useEffect(() => {
    loadAIData();
  }, [state.xp]);

  async function loadAIData() {
    setIsLoadingAI(true);
    setAiError(null);
    try {
      const [tip, recommendations] = await Promise.all([
        aiAssistant.generatePersonalizedTip(state.xp),
        aiAssistant.getResourceRecommendations(state.xp)
      ]);
      setAiStudyTip(tip);
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Failed to load AI data:', error);
      setAiError('Failed to load AI recommendations. Please try again later.');
    } finally {
      setIsLoadingAI(false);
    }
  }

  async function generateAIQuests() {
    setIsGeneratingQuests(true);
    setAiError(null);
    try {
      const newQuests = await aiAssistant.generateSmartQuests(state.xp, state.quests);
      const questsWithIds = newQuests.map((quest, index) => ({
        ...quest,
        id: Date.now() + index,
        completed: false
      }));
      
      setState(prev => ({
        ...prev,
        quests: [...prev.quests.filter(q => !q.completed), ...questsWithIds]
      }));
    } catch (error) {
      console.error('Failed to generate AI quests:', error);
      setAiError('Failed to generate new quests. Please try again.');
    } finally {
      setIsGeneratingQuests(false);
    }
  }

  function completeQuest(questId: number) {
    setState(prev => ({
      ...prev,
      quests: prev.quests.map(quest => 
        quest.id === questId 
          ? { ...quest, completed: true }
          : quest
      )
    }));
  }

  // Weekly quest completion handler
  function completeWeeklyQuest(questId: number) {
    setWeeklyQuests(prev => 
      prev.map(quest => 
        quest.id === questId 
          ? { ...quest, completed: true }
          : quest
      )
    );
    
    // Award XP based on quest subject
    const completedQuest = weeklyQuests.find(q => q.id === questId);
    if (completedQuest) {
      const subjectKey = getSubjectKey(completedQuest.subject);
      if (subjectKey) {
        setState(prev => ({
          ...prev,
          xp: {
            ...prev.xp,
            [subjectKey]: prev.xp[subjectKey] + completedQuest.xp
          }
        }));
      }
    }
  }

  // Helper function to map quest subjects to XP keys
  function getSubjectKey(subject: string): keyof typeof state.xp | null {
    const subjectMapping: Record<string, keyof typeof state.xp> = {
      'Mathematics': 'Math',
      'Physics': 'Physics', 
      'Chemistry': 'Chemistry',
      'Biology': 'Biology',
      'History': 'History',
      'English Language': 'History', // Temporary mapping
      'French': 'History', // Temporary mapping
      'Business Studies': 'History', // Temporary mapping
      'Computer Science': 'History', // Temporary mapping
      'Physical Education': 'History' // Temporary mapping
    };
    return subjectMapping[subject] || null;
  }

  function addXP(subject: keyof typeof state.xp, amount: number) {
    setState(prev => ({
      ...prev,
      xp: {
        ...prev.xp,
        [subject]: prev.xp[subject] + Math.round(amount * prev.settings.xpMultiplier)
      }
    }));
  }

  function getDifficultyColor(difficulty: string) {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-primary';
      case 'Hard':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-xl">
                📚
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Solo Leveling
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-card border border-border rounded-full p-3 cursor-pointer hover:bg-accent transition-colors" data-testid="ai-tip-button">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{aiStudyTip?.content || fallbackTip}</p>
                </TooltipContent>
              </Tooltip>
              
              <div className="flex flex-col items-end">
                <div className="text-sm text-muted-foreground">Total XP</div>
                <div className="text-2xl font-bold text-primary" data-testid="total-xp">{totalXP}</div>
              </div>
            </div>
          </header>

          {/* Subject Mastery */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar className="h-5 w-5 text-primary" />
                Subject Mastery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-around items-end h-48 bg-accent/20 rounded-lg p-4">
                {subjects.map((subject) => (
                  <XPBar
                    key={subject}
                    subject={subject}
                    xp={state.xp[subject]}
                    max={maxXP}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Study Streak */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Study Streak
                  </div>
                  <div className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-medium">
                    {state.studyStreak.length} days
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MiniCalendar highlighted={state.studyStreak} />
                <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
                  <i className="fas fa-info-circle"></i>
                  Highlighted days show completed study sessions
                </div>
              </CardContent>
            </Card>

            {/* Daily Quests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-secondary" />
                    Daily Quests
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateAIQuests}
                      disabled={isGeneratingQuests}
                      className="text-xs"
                      data-testid="generate-ai-quests"
                    >
                      <Bot className="h-3 w-3 mr-1" />
                      {isGeneratingQuests ? 'Generating...' : 'AI Quests'}
                    </Button>
                    <div className="bg-secondary/20 text-secondary px-2 py-1 rounded-full text-xs font-medium">
                      {completedQuests}/{state.quests.length} Complete
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isGeneratingQuests ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
                    <span className="text-sm text-muted-foreground">Generating personalized quests...</span>
                  </div>
                ) : aiError && state.quests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center" data-testid="quests-error-state">
                    <div className="text-destructive mb-2">⚠️</div>
                    <p className="text-sm text-muted-foreground mb-3">{aiError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateAIQuests}
                      className="text-xs"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {state.quests.map((quest) => (
                      <div 
                        key={quest.id}
                        className={`quest-item flex justify-between items-center py-3 px-2 rounded-lg border-b border-border/50 ${
                          quest.completed ? 'opacity-50' : ''
                        }`}
                        data-testid={`quest-${quest.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            quest.completed ? 'bg-muted' : 'bg-primary'
                          }`} />
                          <span className={`text-sm ${
                            quest.completed ? 'line-through' : ''
                          }`}>
                            {quest.title}
                          </span>
                        </div>
                        {quest.completed ? (
                          <div className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground font-medium">
                            ✓ +{quest.xp} XP
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            className="px-3 py-1 text-xs rounded-full quest-button-gradient text-white font-medium hover:scale-105 transition-transform"
                            onClick={() => completeQuest(quest.id)}
                            data-testid={`complete-quest-${quest.id}`}
                          >
                            +{quest.xp} XP
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Weekly Quest Section */}
          <WeeklyQuestSection 
            weeklyQuests={weeklyQuests}
            onCompleteQuest={completeWeeklyQuest}
          />

          {/* AI Smart Recommendations */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  AI Study Recommendations
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Bot className="h-3 w-3" />
                  {isLoadingAI ? 'Analyzing...' : 'AI Powered'}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAI ? (
                <div className="flex items-center justify-center py-8" data-testid="ai-recommendations-loading">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                  <span className="text-sm text-muted-foreground">Analyzing your progress...</span>
                </div>
              ) : aiError ? (
                <div className="flex flex-col items-center justify-center py-8 text-center" data-testid="ai-recommendations-error">
                  <div className="text-destructive mb-2">⚠️</div>
                  <p className="text-sm text-muted-foreground mb-3">{aiError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadAIData}
                    className="text-xs"
                    data-testid="retry-ai-recommendations"
                  >
                    Retry Analysis
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiRecommendations.length > 0 ? aiRecommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                      data-testid={`ai-recommendation-${index}`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <Target className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-sm mb-1">{rec.title}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary capitalize">
                          {rec.type}
                        </span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(rec.priority, 5) }).map((_, i) => (
                            <div key={i} className="w-1 h-1 rounded-full bg-yellow-500"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full text-center py-6 text-muted-foreground">
                      <Sparkles className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                      <p className="text-sm">AI recommendations will appear here based on your progress</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comprehensive Study Resources */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Study Resources
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select value={resourceFilter.category} onValueChange={(value) => setResourceFilter(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="w-40" data-testid="filter-resource-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Categories</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Subject Specific">Subject Specific</SelectItem>
                      <SelectItem value="Past Papers">Past Papers</SelectItem>
                      <SelectItem value="Video Tutorials">Video Tutorials</SelectItem>
                      <SelectItem value="Study Tools">Study Tools</SelectItem>
                      <SelectItem value="Exam Board">Exam Board</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={resourceFilter.subject} onValueChange={(value) => setResourceFilter(prev => ({ ...prev, subject: value }))}>
                    <SelectTrigger className="w-32" data-testid="filter-resource-subject">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Subjects</SelectItem>
                      <SelectItem value="Math">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                  
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {COMPREHENSIVE_RESOURCES
                  .filter(resource => 
                    (resourceFilter.category === 'All' || resource.category === resourceFilter.category) &&
                    (resourceFilter.subject === 'All' || resource.subjects.includes('All') || resource.subjects.includes(resourceFilter.subject))
                  )
                  .map((resource) => (
                    <Tooltip key={resource.name}>
                      <TooltipTrigger asChild>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="resource-link flex flex-col p-4 bg-accent/50 border border-border rounded-lg hover:bg-accent/80 transition-all group h-full"
                          data-testid={`resource-${resource.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <resource.icon className="h-6 w-6 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium truncate">{resource.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">{resource.category}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{resource.description}</p>
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <span>Subjects:</span>
                            <span className="font-medium">{resource.subjects.join(', ')}</span>
                          </div>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="text-sm">{resource.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Past Paper Vault */}
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Archive className="h-5 w-5" />
                  Past Paper Vault
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select value={filter.subject} onValueChange={(value) => setFilter(prev => ({ ...prev, subject: value }))}>
                    <SelectTrigger className="w-32" data-testid="filter-subject">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Subjects</SelectItem>
                      <SelectItem value="Math">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="English">English Literature</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filter.difficulty} onValueChange={(value) => setFilter(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger className="w-32" data-testid="filter-difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Difficulties</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filter.board} onValueChange={(value) => setFilter(prev => ({ ...prev, board: value }))}>
                    <SelectTrigger className="w-32" data-testid="filter-board">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Boards</SelectItem>
                      <SelectItem value="AQA">AQA</SelectItem>
                      <SelectItem value="Edexcel">Edexcel</SelectItem>
                      <SelectItem value="OCR">OCR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredPapers.map((paper) => (
                  <div 
                    key={paper.id}
                    className="paper-card p-4 bg-accent/50 border border-border rounded-lg"
                    data-testid={`paper-${paper.id}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm">{paper.title}</h3>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getDifficultyColor(paper.difficulty)}`} />
                        <span className="text-xs text-muted-foreground">{paper.difficulty}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                      <span>{paper.subject}</span>
                      <span>•</span>
                      <span>{paper.board}</span>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs hover:scale-105 transition-all duration-200"
                        onClick={() => {
                          setSelectedPaper(paper);
                          setIsPaperInfoOpen(true);
                        }}
                        data-testid={`info-paper-${paper.id}`}
                      >
                        <Info className="h-3 w-3 mr-1" />
                        Info
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 text-xs quest-button-gradient text-white hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        onClick={() => window.open(paper.downloadUrl, '_blank')}
                        data-testid={`download-paper-${paper.id}`}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Paper
                      </Button>
                      {paper.markSchemeUrl && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="flex-1 text-xs hover:scale-105 transition-all duration-200"
                          onClick={() => window.open(paper.markSchemeUrl, '_blank')}
                          data-testid={`markscheme-paper-${paper.id}`}
                        >
                          ✓ MS
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
      
      {/* Paper Info Modal */}
      <PaperInfoModal 
        paper={selectedPaper}
        isOpen={isPaperInfoOpen}
        onClose={() => setIsPaperInfoOpen(false)}
      />
    </TooltipProvider>
  );
}
