import { PrismaClient } from '../generated/prisma/client';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

// Generate mock replies for existing comments
async function generateMockReplies(ownerIds: string[]) {
  const prisma = new PrismaClient();
  const comments = await prisma.comments.findMany();
  if (comments.length === 0) {
    console.error('No comments found in the database. Cannot create replies.');
    await prisma.$disconnect();
    return;
  }

  let replyCount = 0;
  for (const comment of comments) {
    for (const ownerId of ownerIds) {
      if (ownerId === comment.ownerId) continue;
      // 5% chance to create a reply
      if (Math.random() < 0.05) {
        // Connect reply to commentText
        const replyTemplates = [
          `I agree with: "${comment.commentText}"`,
          `Interesting point: "${comment.commentText}"`,
          `Thanks for sharing your thoughts: "${comment.commentText}"`,
          `That's a good perspective on "${comment.commentText}"`,
          `You made a great point: "${comment.commentText}"`,
          `Well said!`,
          `Couldn't agree more.`,
          `Nice reply!`,
          `Thanks for your input.`,
          `Appreciate your comment!`
        ];
        const replyText = replyTemplates[Math.floor(Math.random() * replyTemplates.length)];
        try {
          const existingReply = await prisma.replies.findFirst({
            where: {
              ownerId,
              commentId: comment.id,
              replyText: replyText,
            },
          });
          if (!existingReply) {
            await prisma.replies.create({
              data: {
                id: uuidv4(),
                ownerId,
                commentId: comment.id,
                replyText: replyText,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            });
            replyCount++;
            console.log(`[REPLY] ownerId: ${ownerId} replied to commentId: ${comment.id} - "${replyText}"`);
          } else {
            console.log(`[REPLY SKIP] ownerId: ${ownerId} already replied to commentId: ${comment.id}`);
          }
        } catch (err) {
          console.error(`[REPLY ERROR] ownerId: ${ownerId}, commentId: ${comment.id}`, err);
        }
      }
    }
  }

  await prisma.$disconnect();
  console.log(`Inserted ${replyCount} replies.`);
}

// Command-line usage
if (require.main === module) {
  const ownerIds = process.argv.slice(2);
  if (ownerIds.length === 0) {
    console.error('Please provide at least one ownerId as a command-line argument.');
    process.exit(1);
  }
  generateMockReplies(ownerIds).catch(console.error);
}
