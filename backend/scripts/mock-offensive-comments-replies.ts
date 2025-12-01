import { PrismaClient } from '../generated/prisma/client';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

// Generate offensive comments and replies for existing activities and comments
async function generateOffensiveContent(ownerIds: string[]) {
  const prisma = new PrismaClient();
  
  // Offensive comment templates
  const offensiveCommentTemplates = [
    "This is stupid and worthless.",
    "You suck at this.",
    "What a waste of time, idiot.",
    "This is trash.",
    "Nobody cares about your garbage.",
    "You're pathetic.",
    "This is complete bullshit.",
    "Shut up, loser.",
    "You're an embarrassment.",
    "This is the dumbest thing I've ever seen.",
    "Delete this crap.",
    "You have no talent whatsoever.",
    "What a joke.",
    "This is absolutely terrible.",
    "You should be ashamed of yourself."
  ];

  // Offensive reply templates
  const offensiveReplyTemplates = [
    "Nobody asked for your dumb opinion.",
    "You're wrong and stupid.",
    "Shut the hell up.",
    "Your comment is trash.",
    "You're an idiot for saying that.",
    "What a moronic take.",
    "You clearly have no brain.",
    "This reply is worthless.",
    "You're embarrassing yourself.",
    "Stop talking, fool.",
    "Your opinion is garbage.",
    "You don't know what you're talking about, moron.",
    "Get lost, loser.",
    "Nobody wants to hear from you.",
    "You're pathetic."
  ];

  let commentCount = 0;
  let replyCount = 0;

  // Generate offensive comments
  const activities = await prisma.activities.findMany();
  if (activities.length === 0) {
    console.error('No activities found in the database. Cannot create comments.');
  } else {
    for (const activity of activities) {
      for (const ownerId of ownerIds) {
        if (ownerId === activity.ownerId) continue;
        // 15% chance to create an offensive comment
        if (Math.random() < 0.15) {
          const commentText = offensiveCommentTemplates[Math.floor(Math.random() * offensiveCommentTemplates.length)];
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
              console.log(`[OFFENSIVE COMMENT] ownerId: ${ownerId} commented on activityId: ${activity.id} - "${commentText}"`);
            } else {
              console.log(`[COMMENT SKIP] ownerId: ${ownerId} already commented on activityId: ${activity.id}`);
            }
          } catch (err) {
            console.error(`[COMMENT ERROR] ownerId: ${ownerId}, activityId: ${activity.id}`, err);
          }
        }
      }
    }
  }

  // Generate offensive replies
  const comments = await prisma.comments.findMany();
  if (comments.length === 0) {
    console.error('No comments found in the database. Cannot create replies.');
  } else {
    for (const comment of comments) {
      for (const ownerId of ownerIds) {
        if (ownerId === comment.ownerId) continue;
        // 10% chance to create an offensive reply
        if (Math.random() < 0.10) {
          const replyText = offensiveReplyTemplates[Math.floor(Math.random() * offensiveReplyTemplates.length)];
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
              console.log(`[OFFENSIVE REPLY] ownerId: ${ownerId} replied to commentId: ${comment.id} - "${replyText}"`);
            } else {
              console.log(`[REPLY SKIP] ownerId: ${ownerId} already replied to commentId: ${comment.id}`);
            }
          } catch (err) {
            console.error(`[REPLY ERROR] ownerId: ${ownerId}, commentId: ${comment.id}`, err);
          }
        }
      }
    }
  }

  await prisma.$disconnect();
  console.log(`\n=== SUMMARY ===`);
  console.log(`Inserted ${commentCount} offensive comments.`);
  console.log(`Inserted ${replyCount} offensive replies.`);
  console.log(`Total offensive content: ${commentCount + replyCount}`);
}

// Command-line usage
if (require.main === module) {
  const ownerIds = process.argv.slice(2);
  if (ownerIds.length === 0) {
    console.error('Please provide at least one ownerId as a command-line argument.');
    console.error('Usage: ts-node mock-offensive-comments-replies.ts <ownerId1> <ownerId2> ...');
    process.exit(1);
  }
  generateOffensiveContent(ownerIds).catch(console.error);
}
