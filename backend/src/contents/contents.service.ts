import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DatabaseService } from '../database/database.service';
import { firstValueFrom } from 'rxjs';
import { enrichWithUserData } from '../common/utils/user-enrichment.util';
import { serializeModelDates } from 'src/utils/serializeModelDates';


@Injectable()
export class ContentsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly httpService: HttpService,
  ) { }

  async getRecommendedContent(userId: string, activityIds?: string[]) {
    let activities = serializeModelDates(await this.databaseService.activities.findMany({}));
    if (activityIds && activityIds.length > 0) {
      activities = activities.filter(act => !activityIds.includes(act.id));
    }
    const likes = serializeModelDates(await this.databaseService.likes.findMany({ where: { ownerId: userId } }));
    const comments = serializeModelDates(await this.databaseService.comments.findMany({ where: { ownerId: userId } }));
    const views = serializeModelDates(await this.databaseService.views.findMany({ where: { ownerId: userId } }));

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

    // Fetch activities and their likes' ownerIds and comments count
    const recommendations = serializeModelDates(await this.databaseService.activities.findMany({
      where: { id: { in: recommendedIds } },
      include: {
        likes: { select: { ownerId: true } },
        comments: { select: { id: true } }
      }
    })).map(activity => ({
      ...activity,
      likes: activity.likes ? activity.likes.map(like => like.ownerId) : [],
      comments: activity.comments ? activity.comments.length : 0
    }));
    const recommendationsWithUserData = await enrichWithUserData(recommendations);
    if (response.data.reusedContent) {
      return {data: recommendationsWithUserData.map(rec => {
        return serializeModelDates([rec])[0];
      }), reusedContent: true};
    } else {
      return {data: recommendationsWithUserData.map(rec => {
        return serializeModelDates([rec])[0];
      }), reusedContent: false};
    }

  }
}
