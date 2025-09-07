import { useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Lightbulb, ChartBar, Flame, CheckSquare, ExternalLink, Archive, Eye, Download, BookOpen, FileText, Atom } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { AppState } from '@shared/schema';

const DEFAULT_STATE: AppState = {
  xp: {
    Math: 120,
    Physics: 85,
    Chemistry: 90,
    Biology: 75,
    History: 50,
  },
  pastPapers: [
    { id: 1, title: 'Paper 1 (2022)', subject: 'Math', difficulty: 'Medium', board: 'AQA', year: 2022, season: 'May/June', paperNumber: '1', topics: ['Algebra', 'Geometry'], curriculumCode: 'GCSE-MATH-AQA', url: 'https://www.aqa.org.uk/resources/mathematics/gcse/mathematics', downloadUrl: '#', markSchemeUrl: '#' },
    { id: 2, title: 'Paper 2 (2022)', subject: 'Physics', difficulty: 'Hard', board: 'Edexcel', year: 2022, season: 'May/June', paperNumber: '2', topics: ['Forces', 'Energy'], curriculumCode: 'GCSE-PHYS-EDEX', url: 'https://qualifications.pearson.com/en/qualifications/edexcel-gcses/physics-2016.html', downloadUrl: '#', markSchemeUrl: '#' },
    { id: 3, title: 'Paper 1 (2021)', subject: 'Chemistry', difficulty: 'Easy', board: 'OCR', year: 2021, season: 'May/June', paperNumber: '1', topics: ['Atomic Structure', 'Bonding'], curriculumCode: 'GCSE-CHEM-OCR', url: 'https://www.ocr.org.uk/qualifications/gcse/chemistry-gateway-j248/', downloadUrl: '#', markSchemeUrl: '#' },
    { id: 4, title: 'Paper 3 (2022)', subject: 'Biology', difficulty: 'Medium', board: 'AQA', year: 2022, season: 'May/June', paperNumber: '3', topics: ['Cell Biology', 'Genetics'], curriculumCode: 'GCSE-BIO-AQA', url: 'https://www.aqa.org.uk/resources/biology/gcse/biology', downloadUrl: '#', markSchemeUrl: '#' },
    { id: 5, title: 'Paper 1 (2020)', subject: 'History', difficulty: 'Hard', board: 'Edexcel', year: 2020, season: 'May/June', paperNumber: '1', topics: ['Medicine Through Time'], curriculumCode: 'GCSE-HIST-EDEX', url: 'https://qualifications.pearson.com/en/qualifications/edexcel-gcses/history-2016.html', downloadUrl: '#', markSchemeUrl: '#' },
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

const RESOURCE_LINKS = [
  { name: 'Khan Academy', url: 'https://www.khanacademy.org/', icon: BookOpen },
  { name: 'BBC Bitesize', url: 'https://www.bbc.co.uk/bitesize', icon: FileText },
  { name: 'Save My Exams', url: 'https://www.mysavemyexams.com/', icon: FileText },
  { name: 'Physics & Maths Tutor', url: 'https://www.physicsandmathstutor.com/', icon: Atom }
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

export default function Dashboard() {
  const [state, setState] = useLocalStorage('solo_leveling_state', DEFAULT_STATE);
  const [filter, setFilter] = useState({
    subject: 'All',
    difficulty: 'All',
    board: 'All'
  });

  const subjects = useMemo(() => Object.keys(state.xp) as (keyof typeof state.xp)[], [state.xp]);
  const totalXP = useMemo(() => Object.values(state.xp).reduce((a, b) => a + b, 0), [state.xp]);
  const maxXP = useMemo(() => Math.max(...Object.values(state.xp)), [state.xp]);

  const aiTip = useMemo(() => {
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
                  <p>{aiTip}</p>
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
                  <div className="bg-secondary/20 text-secondary px-2 py-1 rounded-full text-xs font-medium">
                    {completedQuests}/{state.quests.length} Complete
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>

          {/* Resource Links */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Study Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {RESOURCE_LINKS.map((resource) => (
                  <a
                    key={resource.name}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="resource-link flex flex-col items-center p-4 bg-accent rounded-lg hover:bg-accent/80 transition-all group"
                    data-testid={`resource-${resource.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <resource.icon className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-center">{resource.name}</span>
                  </a>
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
                      <SelectItem value="Math">Math</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="History">History</SelectItem>
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
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        data-testid={`preview-paper-${paper.id}`}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 text-xs quest-button-gradient text-white hover:scale-105 transition-transform"
                        data-testid={`download-paper-${paper.id}`}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </TooltipProvider>
  );
}
