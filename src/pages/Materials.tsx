import DashboardLayout from '@/components/layout/DashboardLayout';
import { FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Materials() {
  return (
    <DashboardLayout>
      <div className="h-full overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-2xl text-center"
        >
          <FolderOpen className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Materials</h1>
          <p className="text-muted-foreground">
            Your study materials and resources will be available here. Upload, organize, and access all your educational content.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}