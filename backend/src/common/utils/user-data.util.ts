import { DatabaseService } from 'src/database/database.service';

export interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  profileImageUrl: string | null;
}

/**
 * Fetch user data from neon_auth schema by user ID
 * @param db - DatabaseService instance
 * @param userId - User ID to fetch
 * @returns UserData or null if user not found
 */
export async function getUserById(
  db: DatabaseService,
  userId: string,
): Promise<UserData | null> {
  try {
    const user = await db.$queryRawUnsafe<any[]>(
      `SELECT id, raw_json FROM neon_auth.users_sync WHERE id = $1`,
      userId,
    );

    if (!user || user.length === 0) return null;

    return {
      id: user[0].id,
      name: user[0].raw_json?.display_name || null,
      email: user[0].raw_json?.primary_email || null,
      profileImageUrl: user[0].raw_json?.profile_image_url || null,
    };
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    return null;
  }
}

/**
 * Fetch multiple users by their IDs
 * @param db - DatabaseService instance
 * @param userIds - Array of user IDs to fetch
 * @returns Map of userId -> UserData
 */
export async function getUsersByIds(
  db: DatabaseService,
  userIds: string[],
): Promise<Map<string, UserData>> {
  if (userIds.length === 0) return new Map();

  try {
    const users = await db.$queryRawUnsafe<any[]>(
      `SELECT id, raw_json FROM neon_auth.users_sync WHERE id = ANY($1::text[])`,
      userIds,
    );

    const userMap = new Map<string, UserData>();
    users.forEach(user => {
      userMap.set(user.id, {
        id: user.id,
        name: user.raw_json?.display_name || null,
        email: user.raw_json?.primary_email || null,
        profileImageUrl: user.raw_json?.profile_image_url || null,
      });
    });

    return userMap;
  } catch (error) {
    console.error('Error fetching users from neon_auth.users_sync:', error);
    return new Map();
  }
}

/**
 * Enrich an object with user data
 * @param db - DatabaseService instance
 * @param item - Item with ownerId property
 * @param userMap - Optional pre-fetched user map for efficiency
 * @returns Item with added 'user' property
 */
export async function enrichWithUserData<T extends { ownerId: string }>(
  db: DatabaseService,
  item: T,
  userMap?: Map<string, UserData>,
): Promise<T & { user: UserData | null }> {
  const map = userMap || (await getUsersByIds(db, [item.ownerId]));
  return {
    ...item,
    user: map.get(item.ownerId) || null,
  };
}

/**
 * Enrich multiple items with user data
 * @param db - DatabaseService instance
 * @param items - Array of items with ownerId property
 * @returns Items with added 'user' property
 */
export async function enrichMultipleWithUserData<
  T extends { ownerId: string },
>(db: DatabaseService, items: T[]): Promise<(T & { user: UserData | null })[]> {
  if (items.length === 0) return [];

  const userIds = [...new Set(items.map(item => item.ownerId))];
  const userMap = await getUsersByIds(db, userIds);

  return items.map(item => ({
    ...item,
    user: userMap.get(item.ownerId) || null,
  }));
}
