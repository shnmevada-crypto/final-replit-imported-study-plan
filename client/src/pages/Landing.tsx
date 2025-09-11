import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Target, BookOpen, Users, Sparkles, LogIn } from 'lucide-react';

export default function Landing() {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white">Solo Leveling</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Transform your GCSE studies into an epic adventure. Level up your knowledge, 
            complete quests, and master every subject with AI-powered guidance.
          </p>
          <Button 
            size="lg" 
            onClick={handleLogin}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            data-testid="login-button"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Sign In with Google
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-400" />
                XP System
              </CardTitle>
              <CardDescription className="text-gray-300">
                Gain experience points for every study session and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Watch your knowledge grow across Math, Science, English, and more subjects
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                AI Powered
              </CardTitle>
              <CardDescription className="text-gray-300">
                Get personalized study tips and smart quest recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Advanced AI analyzes your performance and suggests the best next steps
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-400" />
                Resources Hub
              </CardTitle>
              <CardDescription className="text-gray-300">
                Access 20+ educational platforms and past papers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                BBC Bitesize, Khan Academy, Save My Exams, and comprehensive past paper vault
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Daily Quests
              </CardTitle>
              <CardDescription className="text-gray-300">
                Complete challenges and maintain your study streak
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Gamified learning keeps you motivated and on track
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-red-400" />
                Progress Tracking
              </CardTitle>
              <CardDescription className="text-gray-300">
                Visualize your learning journey with detailed analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Charts, progress bars, and achievement tracking
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-400" />
                Real Exam Prep
              </CardTitle>
              <CardDescription className="text-gray-300">
                Practice with actual GCSE past papers from AQA, Edexcel, OCR
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                Authentic exam experience with mark schemes and detailed feedback
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Level Up?</h2>
            <p className="text-gray-300 mb-6">
              Join thousands of students who have transformed their study experience. 
              Your GCSE success story starts here.
            </p>
            <Button 
              size="lg" 
              onClick={handleLogin}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              data-testid="cta-login-button"
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}