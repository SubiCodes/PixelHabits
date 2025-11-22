import { PrismaClient } from '../generated/prisma/client';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

// Generate mock likes and views for existing activities
async function generateMockLikesViews(ownerIds: string[]) {
  const prisma = new PrismaClient();
  const activities = await prisma.activities.findMany();
  if (activities.length === 0) {
    console.error('No activities found in the database. Cannot create likes/views.');
    await prisma.$disconnect();
    return;
  }

  let likeCount = 0;
  let viewCount = 0;

  for (const activity of activities) {
    // Each owner can like and view each activity (skip if owner is the activity owner)
    for (const ownerId of ownerIds) {
      if (ownerId === activity.ownerId) continue;
      // Randomly decide if this user likes/views this activity
      const likeChance = Math.random();
      const viewChance = Math.random();
      // Like (50% chance)
      if (likeChance < 0.5) {
        try {
          const existingLike = await prisma.likes.findUnique({
            where: {
              ownerId_activityId: {
                ownerId,
                activityId: activity.id,
              },
            },
          });
          if (!existingLike) {
            await prisma.likes.create({
              data: {
                id: uuidv4(),
                ownerId,
                activityId: activity.id,
                createdAt: new Date().toISOString(),
              },
            });
            likeCount++;
            console.log(`[LIKE] ownerId: ${ownerId} liked activityId: ${activity.id}`);
          } else {
            console.log(`[LIKE SKIP] ownerId: ${ownerId} already liked activityId: ${activity.id}`);
          }
        } catch (err) {
          console.error(`[LIKE ERROR] ownerId: ${ownerId}, activityId: ${activity.id}`, err);
        }
      }
      // View (80% chance)
      if (viewChance < 0.8) {
        try {
          const existingView = await prisma.views.findUnique({
            where: {
              ownerId_activityId: {
                ownerId,
                activityId: activity.id,
              },
            },
          });
          if (!existingView) {
            await prisma.views.create({
              data: {
                id: uuidv4(),
                ownerId,
                activityId: activity.id,
                createdAt: new Date().toISOString(),
              },
            });
            viewCount++;
            console.log(`[VIEW] ownerId: ${ownerId} viewed activityId: ${activity.id}`);
          } else {
            console.log(`[VIEW SKIP] ownerId: ${ownerId} already viewed activityId: ${activity.id}`);
          }
        } catch (err) {
          console.error(`[VIEW ERROR] ownerId: ${ownerId}, activityId: ${activity.id}`, err);
        }
      }
    }
  }

  await prisma.$disconnect();
  console.log(`Inserted ${likeCount} likes and ${viewCount} views.`);
}

// Command-line usage
if (require.main === module) {
  const ownerIds = process.argv.slice(2);
  if (ownerIds.length === 0) {
    console.error('Please provide at least one ownerId as a command-line argument.');
    process.exit(1);
  }
  generateMockLikesViews(ownerIds).catch(console.error);
}
