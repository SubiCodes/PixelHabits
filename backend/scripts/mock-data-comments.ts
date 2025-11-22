import { PrismaClient } from '../generated/prisma/client';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

// Generate mock comments for existing activities
async function generateMockComments(ownerIds: string[]) {
  const prisma = new PrismaClient();
  const activities = await prisma.activities.findMany();
  if (activities.length === 0) {
    console.error('No activities found in the database. Cannot create comments.');
    await prisma.$disconnect();
    return;
  }

  let commentCount = 0;
  for (const activity of activities) {
    for (const ownerId of ownerIds) {
      if (ownerId === activity.ownerId) continue;
      // 20% chance to create a comment
      if (Math.random() < 0.2) {
        // Connect comment to activity caption
        const commentTemplates = [
          `Love this: "${activity.caption}"!`,
          `Great post about "${activity.caption}".`,
          `I totally relate to "${activity.caption}".`,
          `Interesting take: "${activity.caption}"`,
          `Thanks for sharing: "${activity.caption}"`,
          `This inspired me: "${activity.caption}"`,
          `Nice work on "${activity.caption}"!`,
          `I learned something from "${activity.caption}".`,
          `Well said: "${activity.caption}"`,
          `Keep it up! "${activity.caption}"`
        ];
        const commentText = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
        try {
          const existingComment = await prisma.comments.findFirst({
            where: {
              ownerId,
              activityId: activity.id,
              commentText: commentText,
            },
          });
          if (!existingComment) {
            await prisma.comments.create({
              data: {
                id: uuidv4(),
                ownerId,
                activityId: activity.id,
                commentText: commentText,
                createdAt: new Date().toISOString(),
              },
            });
            commentCount++;
            console.log(`[COMMENT] ownerId: ${ownerId} commented on activityId: ${activity.id} - "${commentText}"`);
          } else {
            console.log(`[COMMENT SKIP] ownerId: ${ownerId} already commented on activityId: ${activity.id}`);
          }
        } catch (err) {
          console.error(`[COMMENT ERROR] ownerId: ${ownerId}, activityId: ${activity.id}`, err);
        }
      }
    }
  }

  await prisma.$disconnect();
  console.log(`Inserted ${commentCount} comments.`);
}

// Command-line usage
if (require.main === module) {
  const ownerIds = process.argv.slice(2);
  if (ownerIds.length === 0) {
    console.error('Please provide at least one ownerId as a command-line argument.');
    process.exit(1);
  }
  generateMockComments(ownerIds).catch(console.error);
}
