import { writeFileSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface Habit {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Activity {
  id: string;
  ownerId: string;
  habitId: string;
  caption: string;
  mediaUrls: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Accepts an array of ownerIds
export function generateMockHabitActivityData(ownerIds: string[]) {
  const habits: Habit[] = [];
  const activities: Activity[] = [];

  // Example media URLs (royalty-free images/videos)
  const mediaSamples = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg',
    'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    'https://images.pexels.com/photos/34950/pexels-photo.jpg',
    'https://cdn.pixabay.com/photo/2016/11/29/09/32/animal-1867121_1280.jpg',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg',
    'https://cdn.pixabay.com/photo/2017/01/20/00/30/mountains-1998925_1280.jpg',
  ];

  let ownerIdx = 0;
  while (ownerIdx < ownerIds.length) {
    // Loop 1-3 times per owner
    const loopCount = Math.floor(Math.random() * 3) + 1;
    for (let l = 0; l < loopCount && ownerIdx < ownerIds.length; l++) {
      const ownerId = ownerIds[ownerIdx];
      // Create a habit for this owner
      const habitId = uuidv4();
      const habit = {
        id: habitId,
        ownerId,
        title: `Habit ${habitId.slice(0, 6)}`,
        description: `Description for habit ${habitId}`,
        isPublic: Math.random() > 0.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      habits.push(habit);
      console.log(`[HABIT CREATED] ownerId: ${ownerId}, habitId: ${habitId}, title: ${habit.title}`);

      // Create 3-5 activities for this habit
      const activityCount = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < activityCount; i++) {
        const activityId = uuidv4();
        // Pick 1-3 media URLs
        const mediaCount = Math.floor(Math.random() * 3) + 1;
        const mediaUrls: string[] = [];
        for (let m = 0; m < mediaCount; m++) {
          mediaUrls.push(mediaSamples[Math.floor(Math.random() * mediaSamples.length)]);
        }
        const activity = {
          id: activityId,
          ownerId,
          habitId,
          caption: `Activity ${activityId.slice(0, 6)} for habit ${habitId.slice(0, 6)}`,
          mediaUrls,
          isPublic: Math.random() > 0.5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        activities.push(activity);
        console.log(`[ACTIVITY CREATED] ownerId: ${ownerId}, habitId: ${habitId}, activityId: ${activityId}, caption: ${activity.caption}`);
      }
      ownerIdx++;
    }
  }

  return { habits, activities };
}

// Example usage:
if (require.main === module) {
  // Get ownerIds from command-line arguments
  const ownerIds = process.argv.slice(2);
  if (ownerIds.length === 0) {
    console.error('Please provide at least one ownerId as a command-line argument.');
    process.exit(1);
  }
  const data = generateMockHabitActivityData(ownerIds);
  writeFileSync(
    path.join(__dirname, 'mock-habit-activity-data.json'),
    JSON.stringify(data, null, 2)
  );
  console.log('Mock habit/activity data generated for ownerIds:', ownerIds);
}
