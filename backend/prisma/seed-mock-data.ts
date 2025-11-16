import { PrismaClient } from '../generated/prisma';
import {
  generateMockHabits,
  generateMockActivities,
  generateMockLikes,
  generateMockComments,
} from '../src/common/utils/mock-data.util';

const prisma = new PrismaClient();

/**
 * Seeds mock data (habits, activities, likes, comments) for specified user IDs
 */
async function seedMockData(userIds: string[]) {
  console.log('🌱 Starting mock data seeding for habits, activities, likes, and comments...\n');

  if (userIds.length === 0) {
    console.error('❌ No user IDs provided');
    process.exit(1);
  }

  try {
    let habitCount = 0;
    let activityCount = 0;
    let likeCount = 0;
    let commentCount = 0;

    // For each user, create habits, activities, likes, and comments
    for (const userId of userIds) {
      console.log(`👤 Processing user: ${userId}`);

      // Generate habits for this user
      console.log('  🎯 Creating habits...');
      const habits = generateMockHabits(userId, 5, 40); // 5 habits, 40% public

      for (const habit of habits) {
        await prisma.habit.create({
          data: {
            id: habit.id,
            ownerId: habit.ownerId,
            title: habit.title,
            description: habit.description,
            isPublic: habit.isPublic,
            createdAt: habit.createdAt,
            updatedAt: habit.updatedAt,
          },
        });
        habitCount++;
      }
      console.log(`    ✓ Created ${habits.length} habits`);

      // Generate activities for each habit
      console.log('  📸 Creating activities...');
      const allActivitiesForUser: any[] = [];
      const allHabitsForUser = await prisma.habit.findMany({
        where: { ownerId: userId },
      });

      for (const habit of allHabitsForUser) {
        const activities = generateMockActivities(userId, habit.id, 8, 30); // 8 activities per habit, 30% public

        for (const activity of activities) {
          const createdActivity = await prisma.activity.create({
            data: {
              id: activity.id,
              ownerId: activity.ownerId,
              habitId: activity.habitId,
              caption: activity.caption,
              mediaUrls: activity.mediaUrls,
              isPublic: activity.isPublic,
              createdAt: activity.createdAt,
              updatedAt: activity.updatedAt,
            },
          });
          allActivitiesForUser.push(createdActivity);
          activityCount++;
        }
      }
      console.log(`    ✓ Created ${allActivitiesForUser.length} activities`);

      // Generate likes and comments for public activities from other users
      console.log('  ❤️  Creating likes and comments...');
      const otherUserIds = userIds.filter((id) => id !== userId);

      for (const activity of allActivitiesForUser) {
        if (activity.isPublic && otherUserIds.length > 0) {
          // Add likes
          const likes = generateMockLikes(activity.id as string, otherUserIds, 3);
          for (const like of likes) {
            try {
              await prisma.like.create({
                data: {
                  id: like.id,
                  ownerId: like.ownerId,
                  activityId: like.activityId,
                  createdAt: like.createdAt,
                },
              });
              likeCount++;
            } catch {
              // Ignore unique constraint errors
            }
          }

          // Add comments
          const comments = generateMockComments(activity.id as string, otherUserIds, 2);
          for (const comment of comments) {
            await prisma.comment.create({
              data: {
                id: comment.id,
                ownerId: comment.ownerId,
                activityId: comment.activityId,
                commentText: comment.commentText,
                createdAt: comment.createdAt,
              },
            });
            commentCount++;
          }
        }
      }
      console.log(`    ✓ Created ${likeCount} likes and ${commentCount} comments\n`);
    }

    // Print summary
    console.log('📊 Mock Data Seeding Summary:');
    console.log(`  • Users Processed: ${userIds.length}`);
    console.log(`  • Total Habits Created: ${habitCount}`);
    console.log(`  • Total Activities Created: ${activityCount}`);
    console.log(`  • Total Likes Created: ${likeCount}`);
    console.log(`  • Total Comments Created: ${commentCount}`);

    console.log('\n✅ Mock data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get user IDs from command line arguments
const userIds = process.argv.slice(2);

if (userIds.length === 0) {
  console.error('❌ Please provide at least one user ID as arguments');
  console.error('Usage: ts-node prisma/seed-mock-data.ts <userId1> <userId2> ...');
  console.error('Example: ts-node prisma/seed-mock-data.ts 550e8400-e29b-41d4-a716-446655440000');
  process.exit(1);
}

void seedMockData(userIds);
