import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

export interface MockUser {
  id: string;
  display_name: string;
  primary_email: string;
  signed_up_at_millis: number;
  profile_image_url?: string;
  has_password: boolean;
  is_anonymous: boolean;
  auth_with_email: boolean;
  primary_email_verified: boolean;
  primary_email_auth_enabled: boolean;
}

/**
 * Generates a random mock user for the neon_auth schema
 * Returns the raw_json format that should be stored in the user_sync table
 */
export function generateMockUser(): MockUser {
  const userId = uuidv4();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const displayName = `${firstName} ${lastName}`;
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  const signedUpAtMillis = faker.date
    .past({ years: 2 })
    .getTime();

  return {
    id: userId,
    display_name: displayName,
    primary_email: email,
    signed_up_at_millis: signedUpAtMillis,
    profile_image_url: faker.image.avatar(),
    has_password: false,
    is_anonymous: false,
    auth_with_email: true,
    primary_email_verified: true,
    primary_email_auth_enabled: true,
  };
}

/**
 * Generates multiple random mock users
 */
export function generateMockUsers(count: number): MockUser[] {
  return Array.from({ length: count }, () => generateMockUser());
}
