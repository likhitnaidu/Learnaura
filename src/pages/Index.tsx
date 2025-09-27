import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import ProgressDonut from '@/components/dashboard/ProgressDonut';
import DayCalendar from '@/components/calendar/DayCalendar';
import UpcomingEvents from '@/components/events/UpcomingEvents';
import { progressData } from '@/data/mockData';


const Index = () => {
  return (
    <DashboardLayout>
      <div className="h-full overflow-auto">
        <WelcomeCard />

        {/* Main Content Grid - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          <div className="lg:col-span-5 space-y-6 overflow-auto">
            <PerformanceChart />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              <ProgressDonut 
              data={progressData} 
              title="Subject Progress"
              />
            </div>
          </div>

          {/* Right Column - Calendar and Events */}
          <div className="lg:col-span-7 space-y-6 overflow-auto">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
              {/* Calendar */}
              <div className="space-y-6">
                <DayCalendar />
              </div>
              
              {/* Events */}
              <div className="space-y-6">
                <UpcomingEvents />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
