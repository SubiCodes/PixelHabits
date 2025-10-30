import React, { useState, useRef, useEffect } from 'react';
import { Habit } from '@/store/useHabitStore';


interface ResponsiveCalendarGridProps {
  habit: Habit;
  boxSize?: number; // px
  mainContentRef?: React.RefObject<HTMLDivElement | null>;
}

const ResponsiveCalendarGrid: React.FC<ResponsiveCalendarGridProps> = ({ habit, boxSize = 20, mainContentRef }) => {
  // Calculate today's date and activity dates set first
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(habit.createdAt);
  startDate.setHours(0, 0, 0, 0);
  const activityDates = new Set((habit.activities || []).map((activity) => new Date(activity.createdAt).toDateString()));
  const totalDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;


  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(10); // default
  const [page, setPage] = useState(0);

  // Calculate columns based on main content area width
  useEffect(() => {
    const handleResize = () => {
      let width = 0;
      if (mainContentRef && mainContentRef.current) {
        // Subtract padding (Habit page uses p-2 = 0.5rem * 2 = 16px)
        width = mainContentRef.current.offsetWidth - 16;
      } else if (containerRef.current) {
        width = containerRef.current.offsetWidth;
      }
      const cols = Math.max(1, Math.floor(width / boxSize));
      setColumns(cols);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [boxSize, mainContentRef]);

  const maxPage = totalDays > columns * 5 ? Math.ceil(totalDays / (columns * 5)) - 1 : 0;

  // Calculate grid start date for current page
  const gridStartDate = new Date(startDate);
  gridStartDate.setDate(startDate.getDate() + page * columns * 5);

  // Render boxes
  const boxes = [];
  for (let i = 0; i < columns * 5; i++) {
    const boxDate = new Date(gridStartDate);
    boxDate.setDate(gridStartDate.getDate() + i);
    if (i >= totalDays) {
      boxes.push(
        <div
          key={boxDate.toDateString() + i}
          style={{ width: boxSize, height: boxSize }}
          className="border rounded flex items-center justify-center bg-white"
        />
      );
      continue;
    }
    const dateStr = boxDate.toDateString();
    const hasActivity = activityDates.has(dateStr);
    boxes.push(
      <div
        key={dateStr + i}
        style={{ width: boxSize, height: boxSize }}
        className={`border rounded flex items-center justify-center cursor-pointer ${hasActivity ? 'bg-green-500' : 'bg-white'}`}
        title={boxDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      />
    );
  }


  return (
    <div className="w-full flex flex-col items-center">
      <div
        ref={containerRef}
        className="grid gap-1 justify-center"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {boxes}
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
