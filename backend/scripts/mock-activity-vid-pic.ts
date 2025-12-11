import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '../generated/prisma/client';
import 'dotenv/config';

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

  // Example image URLs (royalty-free)
  const imageSamples = [
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

  // Example video URLs (short royalty-free videos, under 1 min)
  const videoSamples = [
    // Gym & Fitness
    'https://videos.pexels.com/video-files/2795402/2795402-uhd_2560_1440_25fps.mp4', // gym workout
    'https://videos.pexels.com/video-files/3195609/3195609-uhd_2560_1440_25fps.mp4', // running
    'https://videos.pexels.com/video-files/4662011/4662011-uhd_2560_1440_30fps.mp4', // yoga
    'https://videos.pexels.com/video-files/5319643/5319643-uhd_2560_1440_25fps.mp4', // stretching
    'https://videos.pexels.com/video-files/4662041/4662041-uhd_2560_1440_30fps.mp4', // pushups
    'https://videos.pexels.com/video-files/2294361/2294361-uhd_2560_1440_30fps.mp4', // cycling
    'https://videos.pexels.com/video-files/4662065/4662065-uhd_2560_1440_30fps.mp4', // weightlifting
    // Coding & Tech
    'https://videos.pexels.com/video-files/4065662/4065662-uhd_2560_1440_30fps.mp4', // coding screen
    'https://videos.pexels.com/video-files/5926395/5926395-uhd_2560_1440_24fps.mp4', // typing code
    'https://videos.pexels.com/video-files/6804097/6804097-uhd_2560_1440_25fps.mp4', // developer workspace
    'https://videos.pexels.com/video-files/3130284/3130284-uhd_2560_1440_25fps.mp4', // programming
    // Nature & Meditation
    'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4', // meditation
    'https://videos.pexels.com/video-files/4498362/4498362-uhd_2560_1440_25fps.mp4', // nature walk
    'https://videos.pexels.com/video-files/3044146/3044146-uhd_2560_1440_25fps.mp4', // peaceful scene
    // Study & Learning
    'https://videos.pexels.com/video-files/5198255/5198255-uhd_2560_1440_25fps.mp4', // reading
    'https://videos.pexels.com/video-files/8196269/8196269-uhd_2560_1440_25fps.mp4', // studying
    'https://videos.pexels.com/video-files/6985001/6985001-uhd_2560_1440_25fps.mp4', // notebook
    // Writing
    'https://videos.pexels.com/video-files/5645037/5645037-uhd_2560_1440_25fps.mp4', // writing
    'https://videos.pexels.com/video-files/6774276/6774276-uhd_2560_1440_25fps.mp4', // journaling
  ];

  let ownerIdx = 0;
  while (ownerIdx < ownerIds.length) {
    // Loop 1-3 times per owner
    const loopCount = Math.floor(Math.random() * 3) + 1;
    for (let l = 0; l < loopCount && ownerIdx < ownerIds.length; l++) {
      const ownerId = ownerIds[ownerIdx];
      // Create a habit for this owner
      const habitId = uuidv4();
      // More realistic habit titles and descriptions
      const habitTitles = [
        'Morning Gym Routine',
        'Daily Coding Practice',
        'Evening Study Session',
        'Personal Writing Journal',
        'Mindful Meditation',
        'Book Reading Challenge',
        'Healthy Meal Prep',
        'Goal Setting Habit',
        'Cycling for Fitness',
        'Yoga and Stretching',
      ];
      const habitTitle = habitTitles[Math.floor(Math.random() * habitTitles.length)];
      const habitDescriptions = [
        'Focus on gym, coding, studying, or writing.',
        'A daily commitment to self-improvement.',
        'Track your progress in fitness, learning, and personal growth.',
        'Build consistency in healthy habits.',
        'Challenge yourself to grow every day.',
        'Reflect and improve through regular practice.',
        'Stay motivated and accountable.',
        'Make time for personal development.',
        'Balance physical and mental wellness.',
        'Achieve your goals step by step.',
      ];
      const habitDescription = habitDescriptions[Math.floor(Math.random() * habitDescriptions.length)];
      const habit = {
        id: habitId,
        ownerId,
        title: habitTitle,
        description: habitDescription,
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
        // Pick 1-3 media items (mix of videos and images)
        const mediaCount = Math.floor(Math.random() * 3) + 1;
        const mediaUrls: string[] = [];
        for (let m = 0; m < mediaCount; m++) {
          // 50% chance for video, 50% for image
          const useVideo = Math.random() > 0.5;
          if (useVideo) {
            mediaUrls.push(videoSamples[Math.floor(Math.random() * videoSamples.length)]);
          } else {
            mediaUrls.push(imageSamples[Math.floor(Math.random() * imageSamples.length)]);
          }
        }

        // Context-aware captions based on media
        const gymMedia = [
          'gym', 'weights', 'pushups', 'cycling', 'running', 'stretching', 'group exercise', 'yoga', 'exercise', 'workout', '2795402', '3195609', '4662011', '5319643', '4662041', '2294361', '4662065'
        ];
        const codingMedia = [
          'code', 'laptop', 'workspace', 'computer', 'developer', '4065662', '5926395', '6804097', '3130284'
        ];
        const studyMedia = [
          'books', 'study', 'library', 'notebook', 'desk', 'reading', 'research', '5198255', '8196269', '6985001'
        ];
        const writingMedia = [
          'writing', 'journal', 'pen', 'notebook', 'desk', 'reflection', 'planning', '5645037', '6774276'
        ];
        const meditationMedia = [
          'meditation', 'nature', 'peaceful', 'mindful', '3571264', '4498362', '3044146'
        ];

        // Find the first media url and use it to infer type
        const firstMedia = mediaUrls[0] || '';
        let captionType = '';
        if (gymMedia.some(word => firstMedia.includes(word))) {
          const gymCaptions = [
            'Completed a strength workout at the gym.',
            'Focused on cardio and endurance training.',
            'Tried a new exercise routine.',
            'Tracked progress in weightlifting.',
            'Enjoyed a group fitness class.',
            'Practiced yoga and stretching.',
            'Went for a morning run.',
            'Finished a cycling session.',
            'Improved flexibility with stretching.',
            'Pushed through a tough workout.',
          ];
          captionType = gymCaptions[Math.floor(Math.random() * gymCaptions.length)];
        } else if (codingMedia.some(word => firstMedia.includes(word))) {
          const codingCaptions = [
            'Solved a coding challenge.',
            'Worked on a personal project.',
            'Practiced JavaScript algorithms.',
            'Built a new feature for my app.',
            'Debugged and fixed code issues.',
            'Learned a new programming concept.',
            'Refactored old code for better performance.',
            'Explored a new technology stack.',
            'Completed a module in an online course.',
            'Reviewed pull requests.',
          ];
          captionType = codingCaptions[Math.floor(Math.random() * codingCaptions.length)];
        } else if (studyMedia.some(word => firstMedia.includes(word))) {
          const studyCaptions = [
            'Reviewed notes for upcoming exams.',
            'Read a chapter from a textbook.',
            'Completed a study session at the library.',
            'Prepared flashcards for memorization.',
            'Joined a group study session.',
            'Summarized key concepts from class.',
            'Practiced problem-solving exercises.',
            'Organized study materials.',
            'Watched educational videos.',
            'Took practice quizzes.',
          ];
          captionType = studyCaptions[Math.floor(Math.random() * studyCaptions.length)];
        } else if (writingMedia.some(word => firstMedia.includes(word))) {
          const writingCaptions = [
            'Wrote a journal entry about today.',
            'Outlined ideas for a new story.',
            'Reflected on personal growth.',
            'Drafted a blog post.',
            'Completed a writing prompt.',
            'Edited previous journal entries.',
            'Set writing goals for the week.',
            'Practiced creative writing.',
            'Documented daily achievements.',
            'Started a gratitude journal.',
          ];
          captionType = writingCaptions[Math.floor(Math.random() * writingCaptions.length)];
        } else if (meditationMedia.some(word => firstMedia.includes(word))) {
          const meditationCaptions = [
            'Meditated for 10 minutes.',
            'Practiced mindfulness in nature.',
            'Found peace in a quiet moment.',
            'Focused on breathing exercises.',
            'Enjoyed a peaceful walk.',
            'Reflected on gratitude.',
            'Cleared my mind with meditation.',
            'Practiced deep relaxation.',
            'Connected with nature.',
            'Achieved mental clarity.',
          ];
          captionType = meditationCaptions[Math.floor(Math.random() * meditationCaptions.length)];
        } else {
          // fallback: pick a random from all types
          const activityTypes = [
            'Meditated for 10 minutes.',
            'Read a new book.',
            'Joined a group exercise.',
            'Went cycling outdoors.',
            'Practiced yoga.',
            'Did pushups.',
            'Went for a run.',
            'Stretched after workout.',
            'Researched at the library.',
            'Planned in my notebook.',
            'Reviewed a book.',
            'Organized my workspace.',
            'Prepared a healthy meal.',
            'Set new goals.',
            'Reflected on progress.',
            'Worked on skill improvement.',
          ];
          captionType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        }
        const activity = {
          id: activityId,
          ownerId,
          habitId,
          caption: captionType,
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
