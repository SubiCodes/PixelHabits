import { PrismaClient } from "../generated/prisma";
import { generateMockUsers } from '../src/common/utils/mock-data.util';

const prisma = new PrismaClient();

/**
 * Format mock user to raw_json format for neon_auth schema
 */
function formatUserRawJson(user: any): string {
  return JSON.stringify({
    id: user.id,
    display_name: user.display_name,
    has_password: user.has_password,
    is_anonymous: user.is_anonymous,
    primary_email: user.primary_email,
    selected_team: null,
    auth_with_email: user.auth_with_email,
    client_metadata: null,
    oauth_providers: [],
    server_metadata: null,
    otp_auth_enabled: false,
    selected_team_id: null,
    profile_image_url: user.profile_image_url,
    requires_totp_mfa: false,
    signed_up_at_millis: user.signed_up_at_millis,
    passkey_auth_enabled: false,
    last_active_at_millis: user.signed_up_at_millis,
    primary_email_verified: user.primary_email_verified,
    client_read_only_metadata: null,
    primary_email_auth_enabled: user.primary_email_auth_enabled,
  });
}

async function main() {
  console.log('🌱 Starting mock user creation...\n');

  try {
    // Generate mock users only
    console.log('👥 Generating mock users...');
    const users = generateMockUsers(10); // Generate 10 mock users
    console.log(`✓ Generated ${users.length} mock users\n`);

    // Insert users via raw SQL (neon_auth schema)
    console.log('📝 Inserting mock users into neon_auth.users_sync...');
    let insertedCount = 0;
    for (const user of users) {
      const rawJson = formatUserRawJson(user);
      try {
        await prisma.$executeRawUnsafe(
          `INSERT INTO neon_auth.users_sync (raw_json) VALUES ($1::jsonb) ON CONFLICT (id) DO NOTHING`,
          rawJson,
        );
        insertedCount++;
      } catch (error) {
        console.warn(`⚠️  Could not insert user ${user.id}:`, error);
      }
    }
    console.log(`✓ Inserted ${insertedCount} users\n`);

    // Print summary
    console.log('� User Creation Summary:');
    console.log(`  • Total Users Created: ${insertedCount}`);
    users.slice(0, 3).forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.display_name} (${user.primary_email})`);
    });
    if (users.length > 3) {
      console.log(`  ... and ${users.length - 3} more users`);
    }

    console.log('\n✅ Mock user creation completed successfully!');
  } catch (error) {
    console.error('❌ Error during user creation:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
