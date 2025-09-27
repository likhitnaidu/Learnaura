import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Book, 
  Save,
  LogOut,
  Key,
  Mail,
  UserCog
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'teacher' | 'admin';
  stream?: 'JEE' | 'NEET';
  avatar_url?: string;
}

interface Settings {
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
    forum: boolean;
  };
  preferences: {
    theme: string;
    language: string;
    difficulty: string;
    autoSave: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showProgress: boolean;
    allowMessages: boolean;
  };
}

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      push: true,
      reminders: true,
      forum: false
    },
    preferences: {
      theme: 'system',
      language: 'en',
      difficulty: 'medium',
      autoSave: true
    },
    privacy: {
      profileVisible: true,
      showProgress: true,
      allowMessages: true
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
    loadSettings();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Supabase user:', user);
      if (user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        console.log('Profile data:', profileData, 'Error:', error);
        if (error) throw error;
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadSettings = () => {
    // Load from localStorage for now
    const savedSettings = localStorage.getItem('user-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage for now
      localStorage.setItem('user-settings', JSON.stringify(settings));
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    if (!profile) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, ...updatedData });
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateNotificationSetting = (key: keyof Settings['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const updatePreferenceSetting = (key: keyof Settings['preferences'], value: any) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const updatePrivacySetting = (key: keyof Settings['privacy'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="ml-4 text-muted-foreground">
            {isLoading ? "Loading profile..." : "No profile found. Please sign in."}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar_url || `https://i.pravatar.cc/150?u=${profile.id}`} />
                <AvatarFallback>{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">{profile.full_name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{profile.role}</p>
                {profile.stream && (
                  <p className="text-sm text-primary">{profile.stream} Stream</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <Button 
              onClick={() => updateProfile({ full_name: profile.full_name })}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive important updates via email</p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) => updateNotificationSetting('email', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Study Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded about your study schedule</p>
              </div>
              <Switch
                checked={settings.notifications.reminders}
                onCheckedChange={(checked) => updateNotificationSetting('reminders', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Forum Updates</Label>
                <p className="text-sm text-muted-foreground">Notifications for forum replies and mentions</p>
              </div>
              <Switch
                checked={settings.notifications.forum}
                onCheckedChange={(checked) => updateNotificationSetting('forum', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={settings.preferences.theme}
                  onValueChange={(value) => updatePreferenceSetting('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={settings.preferences.language}
                  onValueChange={(value) => updatePreferenceSetting('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="bn">বাংলা</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Default Difficulty Level</Label>
              <Select
                value={settings.preferences.difficulty}
                onValueChange={(value) => updatePreferenceSetting('difficulty', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-save Progress</Label>
                <p className="text-sm text-muted-foreground">Automatically save your learning progress</p>
              </div>
              <Switch
                checked={settings.preferences.autoSave}
                onCheckedChange={(checked) => updatePreferenceSetting('autoSave', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
              </div>
              <Switch
                checked={settings.privacy.profileVisible}
                onCheckedChange={(checked) => updatePrivacySetting('profileVisible', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Progress</Label>
                <p className="text-sm text-muted-foreground">Display your learning progress to teachers</p>
              </div>
              <Switch
                checked={settings.privacy.showProgress}
                onCheckedChange={(checked) => updatePrivacySetting('showProgress', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Messages</Label>
                <p className="text-sm text-muted-foreground">Let other users send you messages</p>
              </div>
              <Switch
                checked={settings.privacy.allowMessages}
                onCheckedChange={(checked) => updatePrivacySetting('allowMessages', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="text-destructive hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
          
          <Button
            onClick={saveSettings}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save All Settings'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}