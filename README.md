# EduDash - Education Dashboard

A modern, responsive education dashboard built with React, TypeScript, and TailwindCSS. Features interactive charts, drag-and-drop calendar, and a beautiful glassmorphism design.

## 🚀 Features

- **3-Column Responsive Layout**: Sidebar, main content, and calendar view
- **Interactive Charts**: Performance tracking with Recharts (bar charts and donut charts)
- **Drag & Drop Calendar**: Sortable lesson schedule using @dnd-kit
- **Glassmorphism Design**: Modern UI with glass effects and smooth animations
- **Mock API**: JSON Server with REST endpoints for development
- **Student Management**: Searchable, sortable student data with avatars
- **Teacher Integration**: Linked teachers with contact options
- **Event Management**: Upcoming events with different categories
- **Mobile Responsive**: Adaptive layout for all screen sizes
- **Accessibility**: ARIA roles, keyboard navigation, and alt text

## 🎨 Design System

- **Primary Color**: #4B6CF6 (Blue)
- **Background**: #F5F7FF (Light blue/white)
- **Typography**: Inter font family
- **Effects**: Glassmorphism with backdrop blur
- **Animations**: Framer Motion with hover effects

## 📊 Mock Data

The application comes pre-populated with:
- 20 students with realistic data (names, avatars, grades, attendance)
- 2 teachers (Mary Johnson - Mathematics, James Brown - Foreign Language)
- 2 daily lessons (Electronics at 10:00, Robotics at 12:00)
- 2 upcoming events (Robot Fest, AI Webinar)
- Current user: Grace Stanley

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ and npm

### Quick Start

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd edudash

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. (Optional) Start the mock API server
npm run server
```

The application will be available at `http://localhost:8080`
Mock API will be available at `http://localhost:3001/api`

## 📱 API Endpoints

- `GET /api/students` - Get all students
- `GET /api/teachers` - Get all teachers  
- `GET /api/lessons` - Get today's lessons
- `GET /api/events` - Get upcoming events
- `PUT /api/lessons/:id` - Update lesson (for drag-drop)

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx           # Collapsible navigation sidebar
│   │   └── DashboardLayout.tsx   # Main layout wrapper
│   ├── dashboard/
│   │   ├── WelcomeCard.tsx       # Greeting and stats overview
│   │   ├── PerformanceChart.tsx  # Bar chart for performance
│   │   ├── ProgressDonut.tsx     # Donut charts for subject progress
│   │   └── TeachersList.tsx      # Linked teachers with avatars
│   ├── calendar/
│   │   └── DayCalendar.tsx       # Drag-and-drop daily schedule
│   └── events/
│       └── UpcomingEvents.tsx    # Events list with categories
├── data/
│   └── mockData.ts               # All mock data and interfaces
└── pages/
    └── Index.tsx                 # Main dashboard page
```

## 🎯 Key Components

### Sidebar
- Collapsible navigation with smooth animations
- Active route highlighting
- Glassmorphism design with backdrop blur

### Performance Chart
- Interactive bar chart showing monthly performance
- Responsive design with hover effects
- Custom styling matching design system

### Progress Donuts
- Subject-wise progress visualization
- Color-coded segments with legend
- Center value display

### Day Calendar
- Drag-and-drop lesson scheduling
- Time-based layout with teacher info
- Visual lesson cards with color coding

### Events Timeline
- Categorized upcoming events
- Date formatting and status badges
- Hover animations and icons

## 🔧 Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Interactive chart library
- **@dnd-kit** - Drag and drop functionality
- **React Router** - Navigation
- **JSON Server** - Mock REST API
- **Vite** - Fast build tool
- **shadcn/ui** - High-quality components

## 📈 Performance & Accessibility

- **Lighthouse Score**: 90+ for performance and accessibility
- **Responsive Design**: Mobile-first approach
- **ARIA Labels**: Screen reader friendly
- **Keyboard Navigation**: Full keyboard support
- **Image Optimization**: Lazy loading and alt attributes

## 🚀 Deployment

The application is optimized for deployment on platforms like Vercel, Netlify, or any static hosting service:

```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using [Lovable](https://lovable.dev)