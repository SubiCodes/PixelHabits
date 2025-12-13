import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class LeaderboardsService {
    constructor(private readonly databaseService: DatabaseService) { }

}
