import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createMockViews(ownerIds: string[]) {
  try {
    // Get all activities
    const activities = await prisma.activity.findMany({
      select: { id: true }
    });

    if (activities.length === 0) {
      console.log('No activities found in database. Please create some activities first.');
      return;
    }

    console.log(`Found ${activities.length} activities`);
    console.log(`Creating mock views for ${ownerIds.length} owner(s)...\n`);

    let totalCreated = 0;

    for (const ownerId of ownerIds) {
      console.log(`Creating views for owner: ${ownerId}`);
      
      // Create views for random activities for this owner
      const numViews = Math.floor(Math.random() * activities.length) + 1; // At least 1 view
      const shuffledActivities = activities.sort(() => 0.5 - Math.random());
      const selectedActivities = shuffledActivities.slice(0, numViews);

      for (const activity of selectedActivities) {
        // Check if view already exists
        const existingView = await prisma.views.findFirst({
          where: {
            ownerId: ownerId,
            activityId: activity.id,
          }
        });

        if (existingView) {
          console.log(`  - View already exists for activity ${activity.id}`);
          continue;
        }

        await prisma.views.create({
          data: {
            ownerId: ownerId,
            activityId: activity.id,
          }
        });

        totalCreated++;
        console.log(`  ✓ Created view for activity ${activity.id}`);
      }

      console.log(`  Total views created for ${ownerId}: ${numViews}\n`);
    }

    console.log(`\n✅ Successfully created ${totalCreated} mock views!`);
  } catch (error) {
    console.error('❌ Error creating mock views:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Get owner IDs from command line arguments
const ownerIds = process.argv.slice(2);

if (ownerIds.length === 0) {
  console.error('❌ Please provide at least one owner ID');
  console.log('Usage: npm run mock-views <ownerId1> <ownerId2> ...');
  process.exit(1);
}

createMockViews(ownerIds);
