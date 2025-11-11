import { UserData } from 'src/common/utils/user-data.util';

export class Activity {
  id?: string;
  ownerId?: string;
  habitId?: string;
  caption?: string | null;
  mediaUrls?: string[];
  isPublic?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  user?: UserData | null;
}
