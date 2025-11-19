from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from src.recommender import get_recommendations

app = FastAPI()


# Define the structure of data NestJS will send
class Activity(BaseModel):
    id: str
    owner_id: str
    habit_id: str
    caption: str | None
    media_urls: list[str]
    is_public: bool
    created_at: str
    updated_at: str

class Like(BaseModel):
    id: str
    owner_id: str
    activity_id: str
    created_at: str

class View(BaseModel):
    id: str
    owner_id: str
    activity_id: str
    created_at: str

class Comment(BaseModel):
    id: str
    owner_id: str
    comment_text: str
    activity_id: str
    created_at: str

class RecommendationRequest(BaseModel):
    user_id: str
    activities: list[Activity]
    likes: list[Like]
    views: list[View]
    comments: list[Comment]
    top_n: int = 10
    cold_start_strategy: str = "popular"


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
        # Convert Pydantic models to dictionaries
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
        
        # Convert DataFrame to list of dicts for JSON response
        recommendations = recs.to_dict('records')
        
        return {
            "user_id": request.user_id,
            "recommendations": recommendations,
            "count": len(recommendations)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
