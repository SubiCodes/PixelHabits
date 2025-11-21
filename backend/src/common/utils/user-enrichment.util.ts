import { PrismaClient } from '@prisma/client';

interface UserData {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const prisma = new PrismaClient();

/**
 * Fetches user data from neon_auth.users_sync table
 */
async function fetchUserData(userId: string): Promise<UserData | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const result = await prisma.$queryRaw<any[]>`
      SELECT 
        id, 
        name,
        email,
        raw_json->>'profile_image_url' as profile_image_url
      FROM neon_auth.users_sync 
      WHERE id = ${userId} AND deleted_at IS NULL
    `;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (result.length === 0) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const row = result[0];
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      id: row.id,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      name: row.name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      email: row.email,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      profileImageUrl: row.profile_image_url,
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

/**
 * Enriches a JSON object by replacing ownerId fields with full user data
 * @param data - Single object or array of objects to enrich
 * @returns Enriched data with owner field containing user information
 */
export async function enrichWithUserData<T extends Record<string, any>>(
  data: T | T[],
): Promise<any> {
  const isArray = Array.isArray(data);
  const items = isArray ? data : [data];

  // Collect all unique owner IDs
  const ownerIds = new Set<string>();

  function collectOwnerIds(obj: any) {
    if (obj && typeof obj === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if ('ownerId' in obj && typeof obj.ownerId === 'string') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        ownerIds.add(obj.ownerId);
      }

      // Recursively check nested objects and arrays
      for (const value of Object.values(obj)) {
        if (Array.isArray(value)) {
          value.forEach(collectOwnerIds);
        } else if (value && typeof value === 'object') {
          collectOwnerIds(value);
        }
      }
    }
  }

  items.forEach(collectOwnerIds);

  // Fetch all user data in parallel
  const userDataMap = new Map<string, UserData>();
  const userDataPromises = Array.from(ownerIds).map(async (userId) => {
    const userData = await fetchUserData(userId);
    if (userData) {
      userDataMap.set(userId, userData);
    }
  });

  await Promise.all(userDataPromises);

  // Enrich the data
  function enrichObject(obj: any): any {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(enrichObject);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const enriched = { ...obj };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if ('ownerId' in enriched && typeof enriched.ownerId === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const userData = userDataMap.get(enriched.ownerId);
      if (userData) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        enriched.owner = userData;
      }
    }

    // Recursively enrich nested objects
    for (const [key, value] of Object.entries(enriched)) {
      if (value && typeof value === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        enriched[key] = enrichObject(value);
      }
    }

    return enriched;
  }

  const enrichedItems = items.map(enrichObject);
  return isArray ? enrichedItems : enrichedItems[0];
}
