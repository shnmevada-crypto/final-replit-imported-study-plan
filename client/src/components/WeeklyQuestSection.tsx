import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  Trophy, 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle2, 
  Circle,
  Info,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { useState } from 'react';
import type { WeeklyQuest } from '../lib/weeklyQuests';

interface WeeklyQuestSectionProps {
  weeklyQuests: WeeklyQuest[];
  onCompleteQuest: (questId: number) => void;
  onExpandQuest?: (questId: number) => void;
}

export function WeeklyQuestSection({ weeklyQuests, onCompleteQuest, onExpandQuest }: WeeklyQuestSectionProps) {
  const [expandedQuest, setExpandedQuest] = useState<number | null>(null);
  
  const completedQuests = weeklyQuests.filter(q => q.completed).length;
  const totalQuests = weeklyQuests.length;
  const progressPercentage = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;
  const totalXP = weeklyQuests.reduce((sum, quest) => sum + (quest.completed ? quest.xp : 0), 0);
  const potentialXP = weeklyQuests.reduce((sum, quest) => sum + quest.xp, 0);

  const getCurrentWeekString = () => {
    if (weeklyQuests.length === 0) return 'Week -';
    const quest = weeklyQuests[0];
    return `Week ${quest.weekNumber}, ${quest.year}`;
  };

  const handleToggleExpand = (questId: number) => {
    setExpandedQuest(prev => prev === questId ? null : questId);
    if (onExpandQuest) {
      onExpandQuest(questId);
    }
  };

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5 text-purple-400" />
              Weekly Challenges
            </CardTitle>
            <CardDescription className="text-gray-300 flex items-center gap-2">
              {getCurrentWeekString()} • Complete intensive subject challenges
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-purple-300">
              {completedQuests}/{totalQuests} completed
            </div>
            <div className="text-lg font-bold text-white">
              {totalXP}/{potentialXP} XP
            </div>
          </div>
        </div>
        <Progress value={progressPercentage} className="w-full mt-3" />
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-96 pr-4">
          <div className="space-y-4">
            {weeklyQuests.map((quest) => (
              <Card 
                key={quest.id} 
                className={`bg-white/5 border-white/20 transition-all duration-200 hover:bg-white/10 ${
                  quest.completed ? 'border-green-500/50 bg-green-500/10' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className={`text-lg flex items-center gap-2 ${
                        quest.completed ? 'text-green-300' : 'text-white'
                      }`}>
                        {quest.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-purple-400" />
                        )}
                        {quest.title}
                        <Badge className={difficultyColors[quest.difficulty]}>
                          {quest.difficulty}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-gray-300 mt-1">
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {quest.subject}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {quest.estimatedTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Trophy className="h-4 w-4" />
                            {quest.xp} XP
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleExpand(quest.id)}
                        className="text-purple-300 hover:text-white hover:bg-purple-600/30"
                        data-testid={`expand-quest-${quest.id}`}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                      {!quest.completed && (
                        <Button
                          size="sm"
                          onClick={() => onCompleteQuest(quest.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          data-testid={`complete-quest-${quest.id}`}
                        >
                          <Target className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                {expandedQuest === quest.id && (
                  <CardContent className="pt-0">
                    <Separator className="mb-4 bg-white/20" />
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Description</h4>
                        <p className="text-gray-300 text-sm">{quest.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2">Topics Covered</h4>
                        <div className="flex flex-wrap gap-2">
                          {quest.topics.map((topic, index) => (
                            <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-400" />
                          Study Tips
                        </h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          {quest.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Circle className="h-2 w-2 mt-2 text-purple-400 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2">Requirements</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          {quest.requirements.map((requirement, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-400 flex-shrink-0" />
                              {requirement}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-blue-400" />
                          Recommended Resources
                        </h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          {quest.resources.map((resource, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <BookOpen className="h-4 w-4 mt-0.5 text-blue-400 flex-shrink-0" />
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>
        
        {weeklyQuests.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-purple-400" />
            <p>Weekly challenges will appear here</p>
            <p className="text-sm mt-2">Check back for subject-specific intensive challenges</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}