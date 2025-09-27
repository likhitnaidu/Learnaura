import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Heart, 
  MessageSquare, 
  Clock, 
  Filter,
  BookOpen,
  Users,
  TrendingUp,
  Star,
  Pin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  subject: string;
  stream: string;
  likes_count: number;
  replies_count: number;
  created_at: string;
  user: {
    full_name: string;
    role: string;
    avatar_url?: string;
  };
  is_pinned?: boolean;
  is_trending?: boolean;
}

interface NewPost {
  title: string;
  content: string;
  subject: string;
  stream: string;
}

export default function Forum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStream, setSelectedStream] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newPost, setNewPost] = useState<NewPost>({
    title: '',
    content: '',
    subject: '',
    stream: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedSubject, selectedStream]);

  const loadPosts = async () => {
    try {
      // Mock data for demonstration
      const mockPosts: ForumPost[] = [
        {
          id: '1',
          title: 'Help with Calculus Integration Problems',
          content: 'I\'m struggling with integration by parts. Can someone explain the LIATE rule with examples?',
          subject: 'Mathematics',
          stream: 'JEE',
          likes_count: 15,
          replies_count: 8,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user: {
            full_name: 'Rahul Sharma',
            role: 'student',
            avatar_url: 'https://i.pravatar.cc/150?img=1'
          },
          is_trending: true
        },
        {
          id: '2',
          title: 'NEET Biology - Photosynthesis Doubts',
          content: 'What are the main differences between C3 and C4 plants? Need detailed explanation for NEET prep.',
          subject: 'Biology',
          stream: 'NEET',
          likes_count: 23,
          replies_count: 12,
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          user: {
            full_name: 'Priya Patel',
            role: 'student',
            avatar_url: 'https://i.pravatar.cc/150?img=2'
          }
        },
        {
          id: '3',
          title: 'Physics - Electromagnetic Induction Study Tips',
          content: 'Best way to approach electromagnetic induction problems? Looking for strategy tips from seniors.',
          subject: 'Physics',
          stream: 'JEE',
          likes_count: 31,
          replies_count: 18,
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          user: {
            full_name: 'Arjun Kumar',
            role: 'student',
            avatar_url: 'https://i.pravatar.cc/150?img=3'
          },
          is_pinned: true
        },
        {
          id: '4',
          title: 'Chemistry - Organic Reactions Mechanism',
          content: 'Need help understanding SN1 vs SN2 reaction mechanisms. Any good resources or mnemonics?',
          subject: 'Chemistry',
          stream: 'JEE',
          likes_count: 19,
          replies_count: 9,
          created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          user: {
            full_name: 'Sneha Reddy',
            role: 'student',
            avatar_url: 'https://i.pravatar.cc/150?img=4'
          }
        },
        {
          id: '5',
          title: 'Study Schedule for Last Month Before NEET',
          content: 'What should be the ideal study schedule for the last month? How to balance revision and practice tests?',
          subject: 'General',
          stream: 'NEET',
          likes_count: 45,
          replies_count: 25,
          created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          user: {
            full_name: 'Dr. Meera Singh',
            role: 'teacher',
            avatar_url: 'https://i.pravatar.cc/150?img=5'
          },
          is_pinned: true,
          is_trending: true
        }
      ];
      
      setPosts(mockPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: "Error loading posts",
        description: "Failed to load forum posts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(post => post.subject === selectedSubject);
    }

    if (selectedStream !== 'all') {
      filtered = filtered.filter(post => post.stream === selectedStream);
    }

    // Sort by pinned, then trending, then by likes
    filtered.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      if (a.is_trending && !b.is_trending) return -1;
      if (!a.is_trending && b.is_trending) return 1;
      return b.likes_count - a.likes_count;
    });

    setFilteredPosts(filtered);
  };

  const createPost = async () => {
    if (!newPost.title || !newPost.content || !newPost.subject || !newPost.stream) {
      toast({
        title: "Incomplete form",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      // For demo, just add to local state
      const mockNewPost: ForumPost = {
        id: Date.now().toString(),
        title: newPost.title,
        content: newPost.content,
        subject: newPost.subject,
        stream: newPost.stream,
        likes_count: 0,
        replies_count: 0,
        created_at: new Date().toISOString(),
        user: {
          full_name: 'You',
          role: 'student',
          avatar_url: 'https://i.pravatar.cc/150?img=44'
        }
      };

      setPosts(prev => [mockNewPost, ...prev]);
      setNewPost({ title: '', content: '', subject: '', stream: '' });
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Post created!",
        description: "Your question has been posted to the forum.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'General'];
  const streams = ['JEE', 'NEET'];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Discussion Forum</h1>
            <p className="text-muted-foreground">Connect with peers and get help from experts</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Discussion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    placeholder="What's your question or topic?"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Subject *</Label>
                    <Select
                      value={newPost.subject}
                      onValueChange={(value) => setNewPost(prev => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Stream *</Label>
                    <Select
                      value={newPost.stream}
                      onValueChange={(value) => setNewPost(prev => ({ ...prev, stream: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select stream" />
                      </SelectTrigger>
                      <SelectContent>
                        {streams.map(stream => (
                          <SelectItem key={stream} value={stream}>{stream}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    placeholder="Describe your question or start a discussion..."
                    className="min-h-[120px]"
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>
                
                <Button onClick={createPost} className="w-full bg-primary hover:bg-primary/90">
                  Post to Forum
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card border-glass-border">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{posts.length}</div>
              <div className="text-sm text-muted-foreground">Total Posts</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-glass-border">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">1.2k</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-glass-border">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">24</div>
              <div className="text-sm text-muted-foreground">Today's Posts</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-glass-border">
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">95%</div>
              <div className="text-sm text-muted-foreground">Solved Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search discussions..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map(subject => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedStream} onValueChange={setSelectedStream}>
            <SelectTrigger className="w-full md:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Streams</SelectItem>
              {streams.map(stream => (
                <SelectItem key={stream} value={stream}>{stream}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <Card className="glass-card border-glass-border">
              <CardContent className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No discussions found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedSubject !== 'all' || selectedStream !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Be the first to start a discussion!'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card border-glass-border hover:border-primary/50 transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={post.user.avatar_url} />
                          <AvatarFallback>{post.user.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {post.is_pinned && <Pin className="w-4 h-4 text-primary" />}
                                {post.is_trending && <TrendingUp className="w-4 h-4 text-orange-500" />}
                                <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                                  {post.title}
                                </h3>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{post.user.full_name}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {post.user.role}
                                </Badge>
                                <Clock className="w-3 h-3" />
                                <span>{formatTimeAgo(post.created_at)}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{post.subject}</Badge>
                              <Badge variant="secondary">{post.stream}</Badge>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground line-clamp-2">
                            {post.content}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.likes_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{post.replies_count} replies</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}