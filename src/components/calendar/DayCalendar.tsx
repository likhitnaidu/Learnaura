import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addHours, startOfDay } from 'date-fns';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, GripVertical } from 'lucide-react';
import { mockLessons, type Lesson } from '@/data/mockData';

interface SortableLessonProps {
  lesson: Lesson;
}

function SortableLesson({ lesson }: SortableLessonProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group ${isDragging ? 'opacity-50' : ''}`}
      {...attributes}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-xl border border-glass-border hover:shadow-md transition-all duration-200 cursor-pointer"
        style={{ 
          backgroundColor: lesson.color + '15',
          borderLeftColor: lesson.color,
          borderLeftWidth: '4px'
        }}
      >
        <div className="flex items-center gap-3">
          <div
            {...listeners}
            className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-foreground">{lesson.title}</h4>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                {lesson.time}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {lesson.teacher} • {lesson.duration} min
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function DayCalendar() {
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const today = new Date();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLessons((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="calendar-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Today's Schedule</h3>
          <p className="text-sm text-muted-foreground">{format(today, 'EEEE, MMMM d')}</p>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={lessons.map(l => l.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {lessons.map((lesson) => (
              <SortableLesson key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {lessons.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No lessons scheduled for today</p>
        </div>
      )}
    </div>
  );
}