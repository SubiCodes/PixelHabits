
import { PrismaClient } from '../generated/prisma/client';
import 'dotenv/config';

// Generate mock comment likes for real comments
async function generateMockCommentLikes(ownerIds: string[]) {
  const prisma = new PrismaClient();
  const comments = await prisma.comments.findMany();
  if (comments.length === 0) {
    console.error('No comments found in the database. Cannot create comment likes.');
    await prisma.$disconnect();
    return;
  }

  let likeCount = 0;
  for (const comment of comments) {
    for (const ownerId of ownerIds) {
      if (ownerId === comment.ownerId) continue; // Don't like own comment
      // 20% chance to like a comment
      if (Math.random() < 0.2) {
        try {
          const existingLike = await prisma.commentLikes.findFirst({
            where: {
              ownerId,
              commentId: comment.id,
            },
          });
          if (!existingLike) {
            await prisma.commentLikes.create({
              data: {
                ownerId,
                commentId: comment.id,
              },
            });
            likeCount++;
            console.log(`[LIKE] ownerId: ${ownerId} liked commentId: ${comment.id}`);
          } else {
            console.log(`[LIKE SKIP] ownerId: ${ownerId} already liked commentId: ${comment.id}`);
          }
        } catch (err) {
          console.error(`[LIKE ERROR] ownerId: ${ownerId}, commentId: ${comment.id}`, err);
        }
      }
    }
  }

  await prisma.$disconnect();
  console.log(`Inserted ${likeCount} comment likes.`);
}

// Command-line usage
if (require.main === module) {
  const ownerIds = process.argv.slice(2);
  if (ownerIds.length === 0) {
    console.error('Please provide at least one ownerId as a command-line argument.');
    process.exit(1);
  }
  generateMockCommentLikes(ownerIds).catch(console.error);
}
