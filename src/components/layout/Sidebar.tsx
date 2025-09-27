import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FolderOpen,
  MessageSquare,
  ClipboardCheck,
  Settings,
  LogOut,
  Menu,
  GraduationCap,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Brain, label: 'AI Tutor', path: '/ai-tutor' },
  { icon: BookOpen, label: 'Lessons', path: '/lessons' },
  { icon: Calendar, label: 'Schedule', path: '/schedule' },
  { icon: FolderOpen, label: 'Materials', path: '/materials' },
  { icon: MessageSquare, label: 'Forum', path: '/forum' },
  { icon: ClipboardCheck, label: 'Assessments', path: '/assessments' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="glass-sidebar h-screen border-r border-glass-border flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-glass-border">
        <motion.div
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <h1 className="font-bold text-lg text-foreground">Learn Aura</h1>
          )}
        </motion.div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="btn-glass w-8 h-8 p-0"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <motion.span
                  initial={false}
                  animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-glass-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <motion.span
            initial={false}
            animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium whitespace-nowrap overflow-hidden"
          >
            Logout
          </motion.span>
        </Button>
      </div>
    </motion.aside>
  );
}