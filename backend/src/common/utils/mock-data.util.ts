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

export interface MockHabit {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockActivity {
  id: string;
  ownerId: string;
  habitId: string;
  caption?: string;
  mediaUrls: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockLike {
  id: string;
  ownerId: string;
  activityId: string;
  createdAt: Date;
}

export interface MockComment {
  id: string;
  ownerId: string;
  activityId: string;
  commentText: string;
  createdAt: Date;
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
export function generateMockUsers(count: number): MockUser[] {
  return Array.from({ length: count }, () => generateMockUser());
}

/**
 * Generates a random mock habit for a user
 */
export function generateMockHabit(
  ownerId: string,
  isPublic = false,
): MockHabit {
  const habitTitles = [
    'Morning Meditation',
    'Exercise',
    'Read Books',
    'Learn Coding',
    'Draw & Sketch',
    'Write Journal',
    'Practice Piano',
    'Learn Languages',
    'Yoga',
    'Running',
    'Swimming',
    'Photography',
    'Cooking',
    'Gardening',
    'Sleep Early',
    'Drink Water',
    'Take Vitamins',
    'Skincare Routine',
    'Stretching',
    'Meditate',
  ];

  const descriptions = [
    'Daily practice to improve mental health',
    'Keeping fit and healthy',
    'Expanding knowledge and vocabulary',
    'Building better coding skills',
    'Expressing creativity through art',
    'Reflecting on daily experiences',
    'Improving musical abilities',
    'Learning a new language',
    'Enhancing flexibility and strength',
    'Building endurance and cardio health',
    'Water sports and fitness',
    'Capturing beautiful moments',
    'Experimenting with new recipes',
    'Connecting with nature',
    'Improving sleep quality',
    'Staying hydrated and healthy',
    'Maintaining health',
    'Glowing skin routine',
    'Preventing injuries',
    'Mindfulness practice',
  ];

  const createdAt = faker.date.past({ years: 1 });
  const updatedAt = faker.date.between({
    from: createdAt,
    to: new Date(),
  });

  return {
    id: faker.database.mongodbObjectId().toLowerCase(),
    ownerId,
    title: faker.helpers.arrayElement(habitTitles),
    description: faker.helpers.arrayElement(descriptions),
    isPublic,
    createdAt,
    updatedAt,
  };
}

/**
 * Generates multiple mock habits for a user
 */
export function generateMockHabits(
  ownerId: string,
  count: number,
  publicPercentage = 30,
): MockHabit[] {
  return Array.from({ length: count }, () => {
    const isPublic = faker.datatype.boolean({
      probability: publicPercentage / 100,
    });
    return generateMockHabit(ownerId, isPublic);
  });
}

/**
 * Generates a random mock activity for a habit
 */
export function generateMockActivity(
  ownerId: string,
  habitId: string,
  isPublic = false,
): MockActivity {
  const captions = [
    'Great workout today! 💪',
    'Feeling amazing after this session',
    'Making progress! 🚀',
    'Consistent wins',
    'Never skip a day',
    'Progress over perfection',
    'Building the habit',
    'One day at a time',
    'Keep going! 🔥',
    'Loving this journey',
    'Habit stacking',
    'Another day, another win',
    'Building momentum',
    'Small steps, big changes',
    "Celebrating today's win",
  ];

  const mediaUrls = [
    'https://via.placeholder.com/600x400?text=Activity1',
    'https://via.placeholder.com/600x400?text=Activity2',
    'https://via.placeholder.com/600x400?text=Activity3',
  ];

  const createdAt = faker.date.recent({ days: 30 });
  const updatedAt = faker.date.between({
    from: createdAt,
    to: new Date(),
  });

  const shouldHaveCaption = faker.datatype.boolean({ probability: 0.7 });
  const shouldHaveMedia = faker.datatype.boolean({ probability: 0.6 });

  return {
    id: faker.database.mongodbObjectId().toLowerCase(),
    ownerId,
    habitId,
    caption: shouldHaveCaption
      ? faker.helpers.arrayElement(captions)
      : undefined,
    mediaUrls: shouldHaveMedia
      ? [faker.helpers.arrayElement(mediaUrls)]
      : [],
    isPublic,
    createdAt,
    updatedAt,
  };
}

/**
 * Generates multiple mock activities for a habit
 */
export function generateMockActivities(
  ownerId: string,
  habitId: string,
  count: number,
  publicPercentage = 20,
): MockActivity[] {
  return Array.from({ length: count }, () => {
    const isPublic = faker.datatype.boolean({
      probability: publicPercentage / 100,
    });
    return generateMockActivity(ownerId, habitId, isPublic);
  });
}

/**
 * Generates a random mock like for an activity
 */
export function generateMockLike(
  likerUserId: string,
  activityId: string,
): MockLike {
  const createdAt = faker.date.recent({ days: 30 });

  return {
    id: faker.database.mongodbObjectId().toLowerCase(),
    ownerId: likerUserId,
    activityId,
    createdAt,
  };
}

/**
 * Generates multiple mock likes for an activity from different users
 */
export function generateMockLikes(
  activityId: string,
  userIds: string[],
  maxLikes?: number,
): MockLike[] {
  const likes: MockLike[] = [];
  const numLikes = Math.min(
    maxLikes || faker.number.int({ min: 0, max: Math.min(5, userIds.length) }),
    userIds.length,
  );
  const shuffledUserIds = faker.helpers.shuffle(userIds);

  for (let i = 0; i < numLikes; i++) {
    likes.push(generateMockLike(shuffledUserIds[i], activityId));
  }

  return likes;
}

/**
 * Generates a random mock comment for an activity
 */
export function generateMockComment(
  userId: string,
  activityId: string,
): MockComment {
  const comments = [
    'Amazing work! Keep it up! 🙌',
    'Inspiration! 💯',
    'Love this! 😍',
    'So cool!',
    'Great progress!',
    'You got this! 💪',
    'Awesome! Keep going!',
    'This is incredible!',
    'Loving your journey!',
    'Absolutely crushing it!',
  ];

  const createdAt = faker.date.recent({ days: 30 });

  return {
    id: faker.database.mongodbObjectId().toLowerCase(),
    ownerId: userId,
    activityId,
    commentText: faker.helpers.arrayElement(comments),
    createdAt,
  };
}

/**
 * Generates multiple mock comments for an activity from different users
 */
export function generateMockComments(
  activityId: string,
  userIds: string[],
  maxComments?: number,
): MockComment[] {
  const comments: MockComment[] = [];
  const numComments = Math.min(
    maxComments ||
      faker.number.int({ min: 0, max: Math.min(4, userIds.length) }),
    userIds.length,
  );
  const shuffledUserIds = faker.helpers.shuffle(userIds);

  for (let i = 0; i < numComments; i++) {
    comments.push(generateMockComment(shuffledUserIds[i], activityId));
  }

  return comments;
}
