import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle } from 'lucide-react';
import { mockTeachers } from '@/data/mockData';

export default function TeachersList() {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Linked Teachers</h3>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {mockTeachers.map((teacher, index) => (
          <motion.div
            key={teacher.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-sidebar-accent/50 to-transparent border border-glass-border hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={teacher.avatar} alt={teacher.name} />
                <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <div>
                <div className="font-medium text-foreground">{teacher.name}</div>
                <div className="text-sm text-muted-foreground">{teacher.subject}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                <Mail className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}