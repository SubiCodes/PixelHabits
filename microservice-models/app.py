from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, ConfigDict
import pandas as pd
from src.recommender import get_recommendations

app = FastAPI()


# Define the structure of data NestJS will send
class Activity(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    owner_id: str = Field(alias="ownerId")
    habit_id: str = Field(alias="habitId")
    caption: str | None
    media_urls: list[str] = Field(alias="mediaUrls")
    is_public: bool = Field(alias="isPublic")
    created_at: str = Field(alias="createdAt")
    updated_at: str = Field(alias="updatedAt")

class Like(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    owner_id: str = Field(alias="ownerId")
    activity_id: str = Field(alias="activityId")
    created_at: str = Field(alias="createdAt")

class View(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    owner_id: str = Field(alias="ownerId")
    activity_id: str = Field(alias="activityId")
    created_at: str = Field(alias="createdAt")

class Comment(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    owner_id: str = Field(alias="ownerId")
    comment_text: str = Field(alias="commentText")
    activity_id: str = Field(alias="activityId")
    created_at: str = Field(alias="createdAt")

class RecommendationRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    user_id: str = Field(alias="userId")
    activities: list[Activity]
    likes: list[Like]
    views: list[View]
    comments: list[Comment]
    top_n: int = Field(default=10, alias="topN")
    cold_start_strategy: str = Field(default="popular", alias="coldStartStrategy")


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
    # ...existing code...
    try:
        # Convert Pydantic models to dictionaries (using snake_case field names)
        activities_data = [activity.model_dump() for activity in request.activities]
        likes_data = [like.model_dump() for like in request.likes]
        views_data = [view.model_dump() for view in request.views]
        comments_data = [comment.model_dump() for comment in request.comments]

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
            user_id=request.user_id,
            top_n=request.top_n,
            cold_start_strategy=request.cold_start_strategy
        )

        # recs is now always a dict with keys: reusedContent, recommendations
        response = {
            "userId": request.user_id,
            "recommendations": recs["recommendations"],
            "reusedContent": recs.get("reusedContent", False),
            "count": len(recs["recommendations"])
        }
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
