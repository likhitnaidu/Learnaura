import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  Target,
  Award,
  BookOpen,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

interface Question {
  id: string;
  question: string;
  options: Json;
  correct_answer: number;
  explanation: string;
  topic: string;
  subject: string;
  difficulty: string;
}

interface AssessmentResult {
  correct_answers: number;
  total_questions: number;
  strengths: string[];
  weaknesses: string[];
  subject_performance: Record<string, { correct: number; total: number; percentage: number }>;
  recommendations: string[];
}

type AssessmentMode = 'start' | 'taking' | 'completed';

export default function Assessment() {
  const [mode, setMode] = useState<AssessmentMode>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [videoLanguageFilter, setVideoLanguageFilter] = useState<string>('All');
  const [videoFeedback, setVideoFeedback] = useState<Record<string,boolean>>({});
  const [userStream, setUserStream] = useState<'JEE' | 'NEET'>('JEE');
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (mode === 'taking' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, timeLeft]);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('stream')
          .eq('id', user.id)
          .single();
        
        if (profile?.stream) {
          setUserStream(profile.stream);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const startAssessment = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('assessment_questions')
        .select('*')
        .eq('stream', userStream)
        .limit(10);

      if (error) throw error;

      if (data && data.length >= 10) {
        // Shuffle questions and take first 10
        const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 10);
        setQuestions(shuffled);
        setMode('taking');
        setTimeLeft(600);
      } else {
        toast({
          title: "Assessment not available",
          description: `Not enough questions available for ${userStream}. Please try again later.`,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error starting assessment",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmitAssessment = async () => {
    setIsLoading(true);
    
    try {
      // Calculate results
      let correctCount = 0;
      const subjectPerformance: Record<string, { correct: number; total: number; percentage: number }> = {};
      const topicPerformance: Record<string, { correct: number; total: number }> = {};

      questions.forEach((question, index) => {
        const userAnswer = selectedAnswers[index];
        const isCorrect = userAnswer === String(question.correct_answer);
        
        if (isCorrect) correctCount++;

        // Track subject performance
        if (!subjectPerformance[question.subject]) {
          subjectPerformance[question.subject] = { correct: 0, total: 0, percentage: 0 };
        }
        subjectPerformance[question.subject].total++;
        if (isCorrect) subjectPerformance[question.subject].correct++;

        // Track topic performance
        if (!topicPerformance[question.topic]) {
          topicPerformance[question.topic] = { correct: 0, total: 0 };
        }
        topicPerformance[question.topic].total++;
        if (isCorrect) topicPerformance[question.topic].correct++;
      });

      // Calculate percentages
      Object.values(subjectPerformance).forEach(subject => {
        subject.percentage = Math.round((subject.correct / subject.total) * 100);
      });

      // Determine strengths and weaknesses
      const strengths: string[] = [];
      const weaknesses: string[] = [];

      Object.entries(topicPerformance).forEach(([topic, performance]) => {
        const percentage = (performance.correct / performance.total) * 100;
        if (percentage >= 70) {
          strengths.push(topic);
        } else if (percentage < 50) {
          weaknesses.push(topic);
        }
      });

      // Generate recommendations
      const recommendations = generateRecommendations(subjectPerformance, weaknesses);

      const assessmentResult: AssessmentResult = {
        correct_answers: correctCount,
        total_questions: questions.length,
        strengths,
        weaknesses,
        subject_performance: subjectPerformance,
        recommendations
      };

      // Save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('student_assessments').insert({
          student_id: user.id,
          stream: userStream,
          total_questions: questions.length,
          correct_answers: correctCount,
          results: assessmentResult as unknown as Json
        });
      }

      setResult(assessmentResult);
      setMode('completed');

    } catch (error: any) {
      toast({
        title: "Error submitting assessment",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecommendations = (subjectPerformance: Record<string, any>, weaknesses: string[]): string[] => {
    const recommendations: string[] = [];
    
    Object.entries(subjectPerformance).forEach(([subject, performance]) => {
      if (performance.percentage < 60) {
        recommendations.push(`Focus more on ${subject} - consider reviewing basic concepts`);
      }
    });

    if (weaknesses.length > 0) {
      recommendations.push(`Work on weak topics: ${weaknesses.join(', ')}`);
    }

    recommendations.push('Regular practice with mock tests will help improve your performance');
    recommendations.push('Use our AI Tutor for personalized help on difficult topics');

    return recommendations;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (percentage: number) => {
    if (percentage >= 80) return <TrendingUp className="w-4 h-4" />;
    if (percentage >= 60) return <Target className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {mode === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-foreground">Assessment Test</h1>
                <p className="text-muted-foreground text-lg">
                  Take this diagnostic test to evaluate your current knowledge in {userStream}
                </p>
              </div>

              <Card className="glass-card border-glass-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Test Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <span>10 minutes duration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span>10 multiple choice questions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-primary" />
                      <span>Covers all subjects</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-primary" />
                      <span>Instant detailed analysis</span>
                    </div>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg space-y-2">
                    <h3 className="font-semibold text-foreground">What you'll get:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Subject-wise performance analysis</li>
                      <li>• Identification of strengths and weaknesses</li>
                      <li>• Personalized study recommendations</li>
                      <li>• Topic-wise improvement suggestions</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={startAssessment}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading Questions...' : 'Start Assessment'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {mode === 'taking' && questions.length > 0 && (
            <motion.div
              key="taking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Progress Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Assessment in Progress</h1>
                  <p className="text-muted-foreground">
                    Question {currentQuestion + 1} of {questions.length}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className={`font-mono ${timeLeft < 60 ? 'text-red-500' : 'text-foreground'}`}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
              </div>

              <Progress 
                value={(currentQuestion + 1) / questions.length * 100} 
                className="h-2"
              />

              <Card className="glass-card border-glass-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {questions[currentQuestion]?.subject}
                    </Badge>
                    <Badge variant="outline">
                      {questions[currentQuestion]?.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    {questions[currentQuestion]?.question}
                  </h2>

                  <div className="space-y-3">
                    {Array.isArray(questions[currentQuestion]?.options) && 
                     (questions[currentQuestion]?.options as string[])?.map((option, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={() => handleAnswerSelect(currentQuestion, option)}
                          className={`w-full p-4 text-left rounded-lg border transition-all ${
                            selectedAnswers[currentQuestion] === option
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-glass-border bg-card hover:bg-sidebar-accent'
                          }`}
                        >
                          <span className="font-medium">
                            {String.fromCharCode(65 + index)}.
                          </span>{' '}
                          {option}
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                    >
                      Previous
                    </Button>

                    {currentQuestion === questions.length - 1 ? (
                      <Button
                        onClick={handleSubmitAssessment}
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isLoading ? 'Submitting...' : 'Submit Assessment'}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                        disabled={!selectedAnswers[currentQuestion]}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {mode === 'completed' && result && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Assessment Complete!</h1>
                <p className="text-muted-foreground">
                  Here's your detailed performance analysis
                </p>
              </div>

              {/* Overall Score */}
              <Card className="glass-card border-glass-border">
                <CardHeader>
                  <CardTitle>Overall Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center space-x-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {result.correct_answers}/{result.total_questions}
                      </div>
                      <p className="text-muted-foreground">Correct Answers</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {Math.round((result.correct_answers / result.total_questions) * 100)}%
                      </div>
                      <p className="text-muted-foreground">Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subject Performance */}
              <Card className="glass-card border-glass-border">
                <CardHeader>
                  <CardTitle>Subject-wise Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(result.subject_performance).map(([subject, performance]) => (
                    <div key={subject} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getPerformanceIcon(performance.percentage)}
                        <span className="font-medium">{subject}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {performance.correct}/{performance.total}
                        </span>
                        <span className={`font-semibold ${getPerformanceColor(performance.percentage)}`}>
                          {performance.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Strengths and Weaknesses */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass-card border-glass-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <TrendingUp className="w-5 h-5" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.strengths.length > 0 ? (
                      <div className="space-y-2">
                        {result.strengths.map((strength, index) => (
                          <Badge key={index} variant="secondary" className="mr-2 mb-2">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Keep practicing to identify your strengths!</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass-card border-glass-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      Areas to Improve
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.weaknesses.length > 0 ? (
                      <div className="space-y-2">
                        {result.weaknesses.map((weakness, index) => (
                          <Badge key={index} variant="outline" className="mr-2 mb-2">
                            {weakness}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Great job! No major weaknesses identified.</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              <Card className="glass-card border-glass-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Personalized Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => {
                    setMode('start');
                    setCurrentQuestion(0);
                    setSelectedAnswers({});
                    setResult(null);
                  }}
                  variant="outline"
                >
                  Retake Assessment
                </Button>
                <Button
                  onClick={() => window.location.href = '/ai-tutor'}
                  className="bg-primary hover:bg-primary/90"
                >
                  Get AI Help
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}