import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProfileService {
  constructor(private readonly databaseService: DatabaseService) { }

  findOne(id: string) {
    return this.databaseService.users_sync.findUnique({
      where: { id },
    });
  }

  update(id: string, updateProfileDto: UpdateProfileDto) {
    if (updateProfileDto.bio !== undefined) {
      return this.databaseService.users_sync.update({
        where: { id },
        data: {
          bio: updateProfileDto.bio,
        },
      });
    }
    if (updateProfileDto.is_new !== undefined) {
      return this.databaseService.users_sync.update({
        where: { id },
        data: {
          isNew: updateProfileDto.is_new,
        },
      });
    }
    return this.findOne(id);
  }

}
