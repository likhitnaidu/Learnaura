-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better data validation
CREATE TYPE public.user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE public.stream_type AS ENUM ('JEE', 'NEET');
CREATE TYPE public.difficulty_level AS ENUM ('easy', 'medium', 'hard');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role user_role NOT NULL DEFAULT 'student',
  stream stream_type,
  phone TEXT,
  date_of_birth DATE,
  school_name TEXT,
  class_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assessment_questions table
CREATE TABLE public.assessment_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of options
  correct_answer INTEGER NOT NULL, -- Index of correct option
  explanation TEXT,
  topic TEXT NOT NULL,
  subject TEXT NOT NULL,
  difficulty difficulty_level NOT NULL DEFAULT 'medium',
  stream stream_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_assessments table for storing results
CREATE TABLE public.student_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stream stream_type NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  results JSONB NOT NULL, -- Detailed results including strengths, weaknesses, recommendations
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forum_posts table
CREATE TABLE public.forum_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  likes INTEGER NOT NULL DEFAULT 0,
  replies INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forum_replies table
CREATE TABLE public.forum_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for assessment_questions (readable by all authenticated users)
CREATE POLICY "Authenticated users can view assessment questions" 
ON public.assessment_questions 
FOR SELECT 
TO authenticated
USING (true);

-- Create RLS policies for student_assessments
CREATE POLICY "Students can view their own assessments" 
ON public.student_assessments 
FOR SELECT 
USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own assessments" 
ON public.student_assessments 
FOR INSERT 
WITH CHECK (auth.uid() = student_id);

-- Create RLS policies for forum_posts
CREATE POLICY "Everyone can view forum posts" 
ON public.forum_posts 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create posts" 
ON public.forum_posts 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" 
ON public.forum_posts 
FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" 
ON public.forum_posts 
FOR DELETE 
USING (auth.uid() = author_id);

-- Create RLS policies for forum_replies
CREATE POLICY "Everyone can view forum replies" 
ON public.forum_replies 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create replies" 
ON public.forum_replies 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own replies" 
ON public.forum_replies 
FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own replies" 
ON public.forum_replies 
FOR DELETE 
USING (auth.uid() = author_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample assessment questions for JEE stream
INSERT INTO public.assessment_questions (question, options, correct_answer, explanation, topic, subject, difficulty, stream) VALUES
('What is the derivative of sin(x)?', '["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"]', 0, 'The derivative of sin(x) is cos(x) by basic differentiation rules.', 'Differentiation', 'Mathematics', 'easy', 'JEE'),
('Which of the following is a noble gas?', '["Oxygen", "Nitrogen", "Helium", "Hydrogen"]', 2, 'Helium is a noble gas with complete electron configuration.', 'Periodic Table', 'Chemistry', 'easy', 'JEE'),
('What is Newton''s second law?', '["F = ma", "F = mv", "F = mgh", "F = mc²"]', 0, 'Newton''s second law states that Force equals mass times acceleration.', 'Newton''s Laws', 'Physics', 'easy', 'JEE'),
('Solve: x² - 5x + 6 = 0', '["x = 2, 3", "x = 1, 6", "x = -2, -3", "x = 0, 5"]', 0, 'Factoring: (x-2)(x-3) = 0, so x = 2 or x = 3', 'Quadratic Equations', 'Mathematics', 'medium', 'JEE'),
('What is the hybridization of carbon in methane?', '["sp", "sp²", "sp³", "sp³d"]', 2, 'Carbon in methane (CH₄) has sp³ hybridization with tetrahedral geometry.', 'Chemical Bonding', 'Chemistry', 'medium', 'JEE'),
('A ball is thrown upward. At maximum height, what is its velocity?', '["Maximum", "Zero", "Minimum", "Cannot be determined"]', 1, 'At maximum height, the velocity becomes zero before the ball starts falling down.', 'Projectile Motion', 'Physics', 'medium', 'JEE'),
('Find the limit: lim(x→0) (sin x)/x', '["0", "1", "∞", "Does not exist"]', 1, 'This is a standard limit that equals 1, fundamental in calculus.', 'Limits', 'Mathematics', 'hard', 'JEE'),
('Which compound shows geometric isomerism?', '["CH₃-CH₂-CH₃", "CH₃-CHCl-CH₃", "CHCl=CHCl", "CH₃-CH₂-OH"]', 2, 'CHCl=CHCl can exist as cis and trans isomers due to the double bond.', 'Isomerism', 'Chemistry', 'hard', 'JEE'),
('A charged particle moves in a magnetic field. The force is maximum when:', '["v ⊥ B", "v ∥ B", "v = 0", "B = 0"]', 0, 'Magnetic force F = qvBsinθ is maximum when θ = 90° (v ⊥ B).', 'Magnetic Force', 'Physics', 'hard', 'JEE'),
('Integration of 1/(1+x²) dx equals:', '["tan⁻¹(x) + C", "sec⁻¹(x) + C", "sin⁻¹(x) + C", "log(1+x²) + C"]', 0, 'The integral of 1/(1+x²) is the inverse tangent function.', 'Integration', 'Mathematics', 'medium', 'JEE');

-- Insert sample assessment questions for NEET stream
INSERT INTO public.assessment_questions (question, options, correct_answer, explanation, topic, subject, difficulty, stream) VALUES
('Which organelle is known as the powerhouse of the cell?', '["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"]', 1, 'Mitochondria produce ATP through cellular respiration, earning the title powerhouse.', 'Cell Biology', 'Biology', 'easy', 'NEET'),
('What is the pH of pure water?', '["6", "7", "8", "9"]', 1, 'Pure water has a pH of 7, which is neutral on the pH scale.', 'Acids and Bases', 'Chemistry', 'easy', 'NEET'),
('Which blood group is universal donor?', '["A", "B", "AB", "O"]', 3, 'O negative blood type is the universal donor as it has no antigens.', 'Blood Groups', 'Biology', 'easy', 'NEET'),
('What is the molecular formula of glucose?', '["C₆H₁₂O₆", "C₆H₁₀O₅", "C₅H₁₀O₅", "C₆H₁₄O₆"]', 0, 'Glucose has the molecular formula C₆H₁₂O₆, a simple sugar.', 'Biomolecules', 'Biology', 'medium', 'NEET'),
('Which gas is produced during photosynthesis?', '["CO₂", "O₂", "N₂", "H₂"]', 1, 'Oxygen is released as a byproduct during the light reactions of photosynthesis.', 'Photosynthesis', 'Biology', 'medium', 'NEET'),
('What type of bond exists between water molecules?', '["Ionic", "Covalent", "Hydrogen", "Metallic"]', 2, 'Water molecules are held together by hydrogen bonds due to electronegativity differences.', 'Chemical Bonding', 'Chemistry', 'medium', 'NEET'),
('Which hormone regulates blood sugar?', '["Insulin", "Thyroxine", "Adrenaline", "Growth hormone"]', 0, 'Insulin, produced by pancreas, regulates blood glucose levels.', 'Endocrine System', 'Biology', 'hard', 'NEET'),
('What is the IUPAC name of acetone?', '["Propanone", "Propanal", "Propanol", "Propanoic acid"]', 0, 'The IUPAC name for acetone (CH₃COCH₃) is propanone.', 'Organic Nomenclature', 'Chemistry', 'hard', 'NEET'),
('Which part of the brain controls balance?', '["Cerebrum", "Cerebellum", "Medulla", "Hypothalamus"]', 1, 'The cerebellum is responsible for balance, coordination, and motor control.', 'Nervous System', 'Biology', 'hard', 'NEET'),
('What is the oxidation state of sulfur in H₂SO₄?', '["+4", "+6", "-2", "0"]', 1, 'In sulfuric acid (H₂SO₄), sulfur has an oxidation state of +6.', 'Oxidation States', 'Chemistry', 'medium', 'NEET');