# PixelHabits ML Recommendation System

Content-Based Filtering recommendation system using Machine Learning (scikit-learn) with cosine similarity for personalized activity feeds.

## Features

- 🤖 **Machine Learning**: Content-Based Filtering with Cosine Similarity
- 🎯 **Personalized**: Tailored recommendations based on user engagement
- ⚡ **Production-Ready**: Optimized for FastAPI integration
- 📊 **Engagement Scoring**: Views (1pt), Likes (2pts), Comments (3pts)

## Project Structure

```
python-algo/
├── src/                    # Production code
│   ├── recommender.py     # ML recommendation function
│   └── __init__.py
├── notebooks/             # Jupyter notebooks for development
│   ├── content_based_recommender.ipynb
│   └── Untitled.ipynb
├── data/                  # Sample data for testing
│   ├── activities.json
│   ├── likes.json
│   ├── views.json
│   └── comments.json
├── tests/                 # Unit tests (future)
├── requirements.txt       # Python dependencies
└── README.md
```

## Installation

```bash
pip install -r requirements.txt
```

## Usage

### In Jupyter Notebook (Development)

```python
from src.recommender import get_recommendations
import pandas as pd

# Load data
df_activities = pd.read_json("data/activities.json")
df_likes = pd.read_json("data/likes.json")
df_views = pd.read_json("data/views.json")
df_comments = pd.read_json("data/comments.json")

# Get recommendations
recommendations = get_recommendations(
    df_activities, df_likes, df_views, df_comments,
    user_id="63b5e5c9-751d-490b-ac2f-5d0f868f5871",
    top_n=10
)
```

### In FastAPI (Production)

```python
from src.recommender import get_recommendations
import pandas as pd

@app.get("/recommendations/{user_id}")
async def get_user_recommendations(user_id: str):
    # Fetch from database
    activities = await prisma.activity.find_many()
    likes = await prisma.like.find_many(where={"owner_id": user_id})
    views = await prisma.view.find_many(where={"owner_id": user_id})
    comments = await prisma.comment.find_many(where={"owner_id": user_id})
    
    # Convert to DataFrames
    df_activities = pd.DataFrame([dict(a) for a in activities])
    df_likes = pd.DataFrame([dict(l) for l in likes])
    df_views = pd.DataFrame([dict(v) for v in views])
    df_comments = pd.DataFrame([dict(c) for c in comments])
    
    # Get ML recommendations
    recommendations = get_recommendations(
        df_activities, df_likes, df_views, df_comments,
        user_id, top_n=20
    )
    
    return recommendations.to_dict('records')
```

## How It Works

1. **Feature Engineering**: Converts activity data (owner, visibility, age) into numerical features
2. **Normalization**: Scales features using StandardScaler
3. **User Profile**: Creates weighted average of activities user engaged with
4. **Similarity Calculation**: Uses cosine similarity to find similar activities
5. **Filtering**: Returns only unseen activities ranked by similarity

## Technologies

- **Python 3.13**
- **pandas**: Data manipulation
- **numpy**: Numerical operations
- **scikit-learn**: ML algorithms (StandardScaler, cosine_similarity)

## Future Improvements

- [ ] Collaborative Filtering (Matrix Factorization/ALS)
- [ ] Hybrid approach (Content + Collaborative)
- [ ] Model caching for performance
- [ ] A/B testing framework
- [ ] Real-time retraining pipeline

## License

MIT
