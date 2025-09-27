import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Users, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { currentUser } from '@/data/mockData';

const stats = [
  { icon: Calendar, label: 'Classes Today', value: '4', color: '#4B6CF6' },
  { icon: TrendingUp, label: 'Progress', value: '92%', color: '#10B981' },
  { icon: Users, label: 'Teachers', value: '12', color: '#F59E0B' },
  { icon: Award, label: 'Achievements', value: '8', color: '#EF4444' },
];

export default function WelcomeCard() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-2xl mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {greeting}, {currentUser.name}!
            </h1>
            <p className="text-muted-foreground">Ready to continue your learning journey?</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Today</div>
          <div className="text-lg font-semibold text-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-white/60 to-white/30 border border-white/20 hover:shadow-md transition-all duration-200"
          >
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: stat.color + '20' }}
            >
              <stat.icon 
                className="w-5 h-5"
                style={{ color: stat.color }}
              />
            </div>
            
            <div>
              <div className="text-xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}