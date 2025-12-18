
interface ResponsiveCalendarGridProps {
  habit: Habit;
  boxSize?: number;
}

import React, { useState, useRef, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import type { Habit } from '@/store/useHabitStore';

interface ResponsiveCalendarGridProps {
  habit: Habit;
  boxSize?: number;
}

const ResponsiveCalendarGrid: React.FC<ResponsiveCalendarGridProps> = ({ habit, boxSize = 20 }) => {
  // Calculate today's date and activity dates set first
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(habit.createdAt);
  startDate.setHours(0, 0, 0, 0);
  const activityDatesSet = new Set((habit.activities || []).map((activity: { createdAt: string | number | Date }) => new Date(activity.createdAt).toDateString()));
  const totalDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Dynamic columns based on parent width
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(10);
  const [page, setPage] = useState(0);
  const rows = 5;
  const isMobile = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    const handleResize = () => {
      let width = 0;
      if (containerRef.current) {
        width = containerRef.current.offsetWidth;
      }
      // 2px gap between columns
      const gap = 2;
  const cols = Math.max(1, Math.floor((width + gap) / (boxSize + gap)) - 4);
  setColumns(cols);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [boxSize]);

  const maxPage = totalDays > columns * rows ? Math.ceil(totalDays / (columns * rows)) - 1 : 0;
  // Calculate grid start date for current page
  const gridStartDate = new Date(startDate);
  gridStartDate.setDate(startDate.getDate() + page * columns * rows);

  return (
    <div className="w-full flex flex-col items-center">
      <div
        ref={containerRef}
        className={`grid gap-x-2 gap-y-1 justify-center w-full ${isMobile ? 'grid-cols-15' : ''}`}
        style={isMobile ? { gridAutoRows: `${boxSize}px` } : { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gridAutoRows: `${boxSize}px` }}
      >
        {(() => {
          const boxes = [];
          for (let i = 0; i < columns * rows; i++) {
            const boxDate = new Date(gridStartDate);
            boxDate.setDate(gridStartDate.getDate() + i);
            const dateStr = boxDate.toDateString();
            const hasActivity = activityDatesSet.has(dateStr);
            // Future day
            if (boxDate > today) {
              boxes.push(
                <div
                  key={boxDate.toDateString() + i}
                  className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center bg-white opacity-40"
                />
              );
              continue;
            }
            // Past day, no activity
            if (!hasActivity && boxDate < today) {
              boxes.push(
                <div
                  key={dateStr + i}
                  className="w-5 h-5 border rounded flex items-center justify-center cursor-pointer bg-gray-200"
                  title={boxDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                />
              );
              continue;
            }
            // Past or today, with activity
            boxes.push(
              <div
                key={dateStr + i}
                className={`w-5 h-5 border rounded flex items-center justify-center cursor-pointer ${hasActivity ? 'bg-green-500' : 'bg-white'}`}
                title={boxDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              />
            );
          }
          return boxes;
        })()}
      </div>
      {maxPage > 0 && (
        <div className="flex justify-between items-center w-full mt-2">
          <button
            className="px-2 py-1 text-xs border rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Previous
          </button>
          <span className="text-xs mx-2">Page {page + 1} of {maxPage + 1}</span>
          <button
            className="px-2 py-1 text-xs border rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
            disabled={page === maxPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ResponsiveCalendarGrid;
