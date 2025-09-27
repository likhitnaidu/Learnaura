import { motion } from 'framer-motion';
import { format, parseISO, isAfter } from 'date-fns';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockEvents, type Event } from '@/data/mockData';

const eventIcons = {
  workshop: Users,
  webinar: Video,
  exam: Clock,
  meeting: Calendar,
};

const eventStyles = {
  workshop: 'bg-warning/10 text-warning border-warning/20',
  webinar: 'bg-primary/10 text-primary border-primary/20',
  exam: 'bg-destructive/10 text-destructive border-destructive/20',
  meeting: 'bg-success/10 text-success border-success/20',
};

export default function UpcomingEvents() {
  const upcomingEvents = mockEvents
    .filter(event => isAfter(parseISO(event.date), new Date()))
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  return (
    <div className="calendar-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
        <Badge variant="secondary" className="text-xs">
          {upcomingEvents.length} events
        </Badge>
      </div>

      <div className="space-y-4">
        {upcomingEvents.map((event, index) => {
          const IconComponent = eventIcons[event.type];
          const eventDate = parseISO(event.date);
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-card/80 to-transparent border border-glass-border hover:shadow-md transition-all duration-200 group"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: event.color + '20' }}
              >
                <IconComponent 
                  className="w-5 h-5"
                  style={{ color: event.color }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground truncate">{event.title}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs capitalize ${eventStyles[event.type]}`}
                  >
                    {event.type}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{format(eventDate, 'MMM d, yyyy')}</span>
                </div>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {upcomingEvents.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No upcoming events</p>
        </div>
      )}
    </div>
  );
}