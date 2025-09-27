import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <motion.main 
        initial={false}
        animate={{ marginLeft: 0 }}
        className="flex-1 overflow-hidden"
      >
        <div className="h-full p-6">
          {children}
        </div>
      </motion.main>
    </div>
  );
}