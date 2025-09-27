export interface Student {
  id: string;
  name: string;
  avatar: string;
  class: string;
  roll: string;
  email: string;
  progress: number;
  attendance: number;
  notes: string;
  schedule?: string[];
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  avatar: string;
  email: string;
}

export interface Lesson {
  id: string;
  title: string;
  time: string;
  duration: number;
  teacher: string;
  color: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  type: 'workshop' | 'webinar' | 'exam' | 'meeting';
  color: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

// Mock current user
export const currentUser: User = {
  id: '1',
  name: 'Grace Stanley',
  role: 'Student',
  avatar: 'https://i.pravatar.cc/150?img=1'
};

// Mock students data
export const mockStudents: Student[] = Array.from({ length: 20 }, (_, i) => ({
  id: `student-${i + 1}`,
  name: [
    'Emma Johnson', 'Liam Smith', 'Olivia Brown', 'Noah Davis', 'Ava Wilson',
    'William Miller', 'Sophia Moore', 'James Taylor', 'Isabella Anderson', 'Benjamin Thomas',
    'Mia Jackson', 'Lucas White', 'Charlotte Harris', 'Henry Martin', 'Amelia Thompson',
    'Alexander Garcia', 'Harper Martinez', 'Michael Robinson', 'Evelyn Clark', 'Daniel Rodriguez'
  ][i],
  avatar: `https://i.pravatar.cc/150?img=${i + 2}`,
  class: ['10A', '10B', '11A', '11B', '12A'][Math.floor(i / 4)],
  roll: `2024${String(i + 1).padStart(3, '0')}`,
  email: [
    'emma.johnson', 'liam.smith', 'olivia.brown', 'noah.davis', 'ava.wilson',
    'william.miller', 'sophia.moore', 'james.taylor', 'isabella.anderson', 'benjamin.thomas',
    'mia.jackson', 'lucas.white', 'charlotte.harris', 'henry.martin', 'amelia.thompson',
    'alexander.garcia', 'harper.martinez', 'michael.robinson', 'evelyn.clark', 'daniel.rodriguez'
  ][i] + '@school.edu',
  progress: Math.floor(Math.random() * 40) + 60, // 60-100%
  attendance: Math.floor(Math.random() * 30) + 70, // 70-100%
  notes: [
    'Excellent performance', 'Needs improvement in math', 'Very active in discussions',
    'Great problem solver', 'Good team player', 'Needs more focus', 'Outstanding student',
    'Improving steadily', 'Creative thinker', 'Responsible student'
  ][i % 10]
}));

// Mock teachers data
export const mockTeachers: Teacher[] = [
  {
    id: 'teacher-1',
    name: 'Mary Johnson',
    subject: 'Mathematics',
    avatar: 'https://i.pravatar.cc/150?img=22',
    email: 'mary.johnson@school.edu'
  },
  {
    id: 'teacher-2',
    name: 'James Brown',
    subject: 'Foreign Language',
    avatar: 'https://i.pravatar.cc/150?img=23',
    email: 'james.brown@school.edu'
  }
];

// Mock lessons data
export const mockLessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Electronics',
    time: '10:00',
    duration: 90, // minutes
    teacher: 'Mary Johnson',
    color: '#4B6CF6'
  },
  {
    id: 'lesson-2',
    title: 'Robotics',
    time: '12:00',
    duration: 120, // minutes
    teacher: 'James Brown',
    color: '#10B981'
  }
];

// Mock events data
export const mockEvents: Event[] = [
  {
    id: 'event-1',
    title: 'Robot Fest',
    date: '2024-12-14',
    type: 'workshop',
    color: '#F59E0B'
  },
  {
    id: 'event-2',
    title: 'AI Webinar',
    date: '2024-12-09',
    type: 'webinar',
    color: '#8B5CF6'
  }
];

// Performance chart data
export const performanceData = [
  { month: 'Jan', score: 85 },
  { month: 'Feb', score: 78 },
  { month: 'Mar', score: 92 },
  { month: 'Apr', score: 88 },
  { month: 'May', score: 95 },
  { month: 'Jun', score: 89 }
];

// Progress data for donut charts
export const progressData = [
  { name: 'Math', value: 85, color: '#4B6CF6' },
  { name: 'Science', value: 92, color: '#10B981' },
  { name: 'English', value: 78, color: '#F59E0B' },
  { name: 'History', value: 88, color: '#EF4444' }
];