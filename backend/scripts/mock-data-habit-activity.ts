import { writeFileSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

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
export async function generateMockHabitActivityData(ownerIds: string[]) {
  const habits: Habit[] = [];
  const activities: Activity[] = [];

  // Example media URLs (royalty-free images/videos)
  const mediaSamples = [
    // Gym & Exercise
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', // gym weights
    'https://images.unsplash.com/photo-1518611012118-696072aa579a', // running
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb', // yoga
    'https://images.pexels.com/photos/2261487/pexels-photo-2261487.jpeg', // pushups
    'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg', // gym
    'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg', // cycling
    'https://images.pexels.com/photos/375737/pexels-photo-375737.jpeg', // running shoes
    'https://images.pexels.com/photos/260352/pexels-photo-260352.jpeg', // stretching
    'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg', // group exercise
    'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg', // gym
    // Coding & Tech
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c', // laptop coding
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2', // code on screen
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6', // developer workspace
    'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg', // code
    'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg', // laptop
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg', // coding
    'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg', // computer
    'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg', // code
    'https://images.pexels.com/photos/1181359/pexels-photo-1181359.jpeg', // workspace
    // Studying & Reading
    'https://images.unsplash.com/photo-1513258496099-48168024aec0', // books
    'https://images.unsplash.com/photo-1465101178521-c1a4c8a0a8b7', // reading
    'https://images.unsplash.com/photo-1517841905240-472988babdf9', // study
    'https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg', // reading
    'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg', // books
    'https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg', // study
    'https://images.pexels.com/photos/207662/pexels-photo-207662.jpeg', // library
    'https://images.pexels.com/photos/267586/pexels-photo-267586.jpeg', // notebook
    'https://images.pexels.com/photos/414519/pexels-photo-414519.jpeg', // desk
    // Writing & Journaling
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d', // writing
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e', // journal
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', // pen
    'https://images.pexels.com/photos/210661/pexels-photo-210661.jpeg', // writing
    'https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg', // notebook
    'https://images.pexels.com/photos/414519/pexels-photo-414519.jpeg', // desk
    'https://images.pexels.com/photos/267586/pexels-photo-267586.jpeg', // notebook
    'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg', // books
    // Miscellaneous Self-Improvement
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', // meditation
    'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg', // gym
    'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg', // group exercise
    'https://images.pexels.com/photos/375737/pexels-photo-375737.jpeg', // running shoes
    'https://images.pexels.com/photos/260352/pexels-photo-260352.jpeg', // stretching
    'https://images.pexels.com/photos/2261487/pexels-photo-2261487.jpeg', // pushups
    'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg', // gym
    'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg', // cycling
    'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg', // yoga
    'https://images.pexels.com/photos/34950/pexels-photo.jpg', // yoga
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
  (async () => {
    // Get ownerIds from command-line arguments
    const ownerIds = process.argv.slice(2);
    if (ownerIds.length === 0) {
      console.error('Please provide at least one ownerId as a command-line argument.');
      process.exit(1);
    }
    const prisma = new PrismaClient();
    const data = await generateMockHabitActivityData(ownerIds);
    writeFileSync(
      path.join(__dirname, 'mock-habit-activity-data.json'),
      JSON.stringify(data, null, 2)
    );
    console.log('Mock habit/activity data generated for ownerIds:', ownerIds);

    // Insert habits
    for (const habit of data.habits) {
      await prisma.habits.create({ data: habit });
      console.log(`[DB] Inserted habit ${habit.id}`);
    }
    // Insert activities
    for (const activity of data.activities) {
      await prisma.activities.create({ data: activity });
      console.log(`[DB] Inserted activity ${activity.id}`);
    }
    await prisma.$disconnect();
    console.log('All mock habits and activities uploaded to the database.');
  })().catch(console.error);
}
