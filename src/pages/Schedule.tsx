import DashboardLayout from '@/components/layout/DashboardLayout';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Schedule() {
  return (
    <DashboardLayout>
      <div className="h-full overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-2xl text-center"
        >
          <Calendar className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Schedule</h1>
          <p className="text-muted-foreground">
            Your complete schedule view is coming soon. You'll be able to see weekly and monthly calendars with all your classes and events.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}