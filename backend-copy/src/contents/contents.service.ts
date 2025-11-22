import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DatabaseService } from '../database/database.service';
import { firstValueFrom } from 'rxjs';
import { enrichWithUserData } from '../common/utils/user-enrichment.util';

@Injectable()
export class ContentsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly httpService: HttpService,
    ) { }

    async getRecommendedContent(userId: string) {

        const activities = await this.databaseService.activities.findMany({});
        const likes = await this.databaseService.likes.findMany({ where: { ownerId: userId } });
        const comments = await this.databaseService.comments.findMany({ where: { ownerId: userId } });
        const views = await this.databaseService.views.findMany({ where: { ownerId: userId } });

        // Prepare ML request payload
        const mlUrl = process.env.MICROSERVICE_ML_URL || 'http://localhost:8000';
        const payload = {
            userId,
            activities,
            likes,
            views,
            comments,
            topN: 10,
            coldStartStrategy: 'popular',
        };

        const response = await firstValueFrom(
            this.httpService.post(`${mlUrl}/recommendations`, payload)
        );

        const recommendedIds = response.data.recommendations.map(rec => rec.id);

        const recommendations = await this.databaseService.activities.findMany({
            where: { id: { in: recommendedIds } },
        });
        const recommendationsWithUserData = await enrichWithUserData(recommendations);
        return recommendationsWithUserData;
    }
}
