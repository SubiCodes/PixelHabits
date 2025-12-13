import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class LeaderboardsService {
    constructor(private readonly databaseService: DatabaseService) { }

    @Cron('0 0 * * *', {
        timeZone: 'Asia/Manila',
    })
    async updateLeaderboards() {
        console.log('Updating leaderboards at 12AM Philippine time');
        // Calculation logic will go here
    }
}
