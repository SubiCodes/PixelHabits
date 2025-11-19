import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DatabaseService } from '../database/database.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ContentsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly httpService: HttpService,
    ) {}   

    async getRecommendedContent(userId: string) {
        const activities = await this.databaseService.activity.findMany({});
        const likes = await this.databaseService.likes.findMany({});
        const comments = await this.databaseService.comments.findMany({});
        const views = await this.databaseService.views.findMany({});

        const mlUrl = process.env.MICROSERVICE_ML_URL || 'http://localhost:8000';
        const response = await firstValueFrom(
            this.httpService.post(`${mlUrl}/recommendations`, {
                user_id: userId,
                activities,
                likes,
                views,
                comments,
                top_n: 10,
                cold_start_strategy: 'popular',
            })
        );

        const recommendedIds = response.data.recommendations.map(rec => rec.id);
        
        const recommendations = await this.databaseService.activity.findMany({
            where: { id: { in: recommendedIds } },
        });

        return recommendations;
    }
}
