import { Controller, Get } from '@nestjs/common';
import { LeaderboardsService } from './leaderboards.service';

@Controller('leaderboards')
export class LeaderboardsController {
    constructor(private readonly leaderboardsService: LeaderboardsService) {}

    @Get()
    async getLeaderboards() {
        return this.leaderboardsService.getLeaderboards();
    }
}
