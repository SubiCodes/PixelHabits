from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from src.recommender import get_recommendations

app = FastAPI()


# Define the structure of data NestJS will send
class Activity(BaseModel):
    id: str
    ownerId: str
    habitId: str
    caption: str | None
    mediaUrls: list[str]
    isPublic: bool
    createdAt: str
    updatedAt: str

class Like(BaseModel):
    id: str
    ownerId: str
    activityId: str
    createdAt: str

class View(BaseModel):
    id: str
    ownerId: str
    activityId: str
    createdAt: str

class Comment(BaseModel):
    id: str
    ownerId: str
    commentText: str
    activityId: str
    createdAt: str

class RecommendationRequest(BaseModel):
    userId: str
    activities: list[Activity]
    likes: list[Like]
    views: list[View]
    comments: list[Comment]
    topN: int = 10
    coldStartStrategy: str = "popular"


# Hello World endpoint
@app.get("/")
def hello_world():
    return {"message": "PixelHabits ML API", "status": "running"}


# POST endpoint for recommendations
@app.post("/recommendations")
def get_user_recommendations(request: RecommendationRequest):
    """
    Get personalized recommendations for a user
    
    NestJS should send:
    - user_id: The user to get recommendations for
    - activities: All activities in the system
    - likes: User's likes
    - views: User's views  
    - comments: User's comments
    - top_n: Number of recommendations (optional, default 10)
    - cold_start_strategy: 'newest', 'popular', or 'random' (optional, default 'popular')
    """
    try:
        # Convert Pydantic models to dictionaries with snake_case keys for ML model
        activities_data = []
        for activity in request.activities:
            activities_data.append({
                'id': activity.id,
                'owner_id': activity.ownerId,
                'habit_id': activity.habitId,
                'caption': activity.caption,
                'media_urls': activity.mediaUrls,
                'is_public': activity.isPublic,
                'created_at': activity.createdAt,
                'updated_at': activity.updatedAt,
            })
        
        likes_data = [{'id': l.id, 'owner_id': l.ownerId, 'activity_id': l.activityId, 'created_at': l.createdAt} for l in request.likes]
        views_data = [{'id': v.id, 'owner_id': v.ownerId, 'activity_id': v.activityId, 'created_at': v.createdAt} for v in request.views]
        comments_data = [{'id': c.id, 'owner_id': c.ownerId, 'comment_text': c.commentText, 'activity_id': c.activityId, 'created_at': c.createdAt} for c in request.comments]
        
        
        # Convert to pandas DataFrames
        df_activities = pd.DataFrame(activities_data)
        df_likes = pd.DataFrame(likes_data)
        df_views = pd.DataFrame(views_data)
        df_comments = pd.DataFrame(comments_data)
        
        # Get recommendations from ML model
        recs = get_recommendations(
            df_activities=df_activities,
            df_likes=df_likes,
            df_views=df_views,
            df_comments=df_comments,
            user_id=request.userId,
            top_n=request.topN,
            cold_start_strategy=request.coldStartStrategy
        )
        
        # Convert DataFrame to list of dicts for JSON response
        recommendations = recs.to_dict('records')
        
        return {
            "userId": request.userId,
            "recommendations": recommendations,
            "count": len(recommendations)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
