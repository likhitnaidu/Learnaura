import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, GraduationCap, Brain, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type AuthMode = 'signin' | 'signup' | 'stream-selection';
type UserRole = 'student';
type Stream = 'JEE' | 'NEET';

interface FormData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  stream?: Stream;
}

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    fullName: '',
    role: 'student'
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "Successfully signed in to Learn Aura.",
      });

      // Redirect will be handled by auth state change
    } catch (error: any) {
      let title = "Sign in failed";
      let description = error.message;
      
      if (error.message === "Email not confirmed") {
        title = "Email not verified";
        description = "Please check your email and click the verification link before signing in. Check your spam folder if you don't see the email.";
      }
      
      toast({
        title,
        description,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.role === 'student') {
      setMode('stream-selection');
      return;
    }

    await completeSignUp();
  };

  const completeSignUp = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            // Do NOT store plain password here
            // password: formData.password // <-- Not recommended!
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: formData.role === 'student' 
          ? "Please check your email to verify your account, then you'll take an assessment."
          : "Please check your email to verify your account.",
      });

      // Redirect to quiz page if student
      if (formData.role === 'student' && formData.stream) {
        setTimeout(() => {
          navigate(`/quiz?stream=${formData.stream}`);
        }, 2000); // Give user time to read toast
      } else {
        setTimeout(() => {
          setMode('signin');
        }, 2000);
      }

      // Reset form
      setFormData({
        email: '',
        password: '',
        fullName: '',
        role: 'student'
      });

    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamSelection = (stream: Stream) => {
    setFormData(prev => ({ ...prev, stream }));
    completeSignUp();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block space-y-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Learn Aura</h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Your AI-Powered Learning Companion
            </h2>
            <p className="text-muted-foreground text-lg">
              Master JEE & NEET with personalized AI tutoring, interactive assessments, and comprehensive study materials.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="glass-card p-4 space-y-2">
              <Brain className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-foreground">AI Tutor</h3>
              <p className="text-sm text-muted-foreground">Get instant help from our intelligent tutoring system</p>
            </div>
            <div className="glass-card p-4 space-y-2">
              <BookOpen className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-foreground">Smart Assessments</h3>
              <p className="text-sm text-muted-foreground">Adaptive tests that identify your strengths</p>
            </div>
            <div className="glass-card p-4 space-y-2">
              <Users className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-foreground">Collaborative Learning</h3>
              <p className="text-sm text-muted-foreground">Connect with peers </p>
            </div>
            <div className="glass-card p-4 space-y-2">
              <GraduationCap className="w-8 h-8 text-primary" />
              <h3 className="font-semibold text-foreground">Exam Ready</h3>
              <p className="text-sm text-muted-foreground">Comprehensive preparation for JEE & NEET</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Auth Forms */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <AnimatePresence mode="wait">
            {mode === 'stream-selection' ? (
              <motion.div
                key="stream-selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass-card border-glass-border">
                  <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-2xl font-bold text-foreground">Choose Your Stream</CardTitle>
                    <CardDescription>Select your preparation track to get personalized content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStreamSelection('JEE')}
                        className="glass-card p-6 cursor-pointer border-2 border-transparent hover:border-primary/50 transition-all group"
                      >
                        <div className="text-center space-y-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                            <Brain className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="font-semibold text-foreground">JEE</h3>
                          <p className="text-sm text-muted-foreground">Joint Entrance Examination for Engineering</p>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStreamSelection('NEET')}
                        className="glass-card p-6 cursor-pointer border-2 border-transparent hover:border-primary/50 transition-all group"
                      >
                        <div className="text-center space-y-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                            <BookOpen className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="font-semibold text-foreground">NEET</h3>
                          <p className="text-sm text-muted-foreground">National Eligibility Entrance Test for Medical</p>
                        </div>
                      </motion.div>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setMode('signup')}
                      className="w-full"
                      disabled={isLoading}
                    >
                      Back to Sign Up
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass-card border-glass-border">
                  <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-2xl font-bold text-foreground">
                      {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                    </CardTitle>
                    <CardDescription>
                      {mode === 'signin' 
                        ? 'Sign in to continue your learning journey'
                        : 'Join Learn Aura and start your preparation'
                      }
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
                      
                      {mode === 'signup' && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              type="text"
                              value={formData.fullName}
                              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                              required
                              className="bg-background/50 border-glass-border"
                              placeholder="Enter your full name"
                            />
                          </div>
                          
                          
                        </>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                          className="bg-background/50 border-glass-border"
                          placeholder="Enter your email"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            required
                            className="bg-background/50 border-glass-border pr-10"
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
                      </Button>
                    </form>
                    
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                        className="text-primary hover:underline text-sm"
                      >
                        {mode === 'signin' 
                          ? "Don't have an account? Sign up" 
                          : 'Already have an account? Sign in'
                        }
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}