
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler

def get_recommendations(df_activities, df_likes, df_views, df_comments, user_id, top_n=10):
    """
    Get personalized recommendations for a user using Content-Based Filtering

    Parameters:
    - df_activities: DataFrame of ALL activities in the system
    - df_likes: DataFrame of user's likes
    - df_views: DataFrame of user's views
    - df_comments: DataFrame of user's comments
    - user_id: The user to generate recommendations for
    - top_n: Number of recommendations to return

    Returns: DataFrame with top N recommended activities
    """

    # 1. Calculate engagement scores
    engagement_scores = {}
    for _, row in df_views.iterrows():
        engagement_scores[row['activity_id']] = engagement_scores.get(row['activity_id'], 0) + 1
    for _, row in df_likes.iterrows():
        engagement_scores[row['activity_id']] = engagement_scores.get(row['activity_id'], 0) + 2
    for _, row in df_comments.iterrows():
        engagement_scores[row['activity_id']] = engagement_scores.get(row['activity_id'], 0) + 3

    # 2. Prepare activity features
    df_act = df_activities.copy()
    df_act['created_at'] = pd.to_datetime(df_act['created_at'])
    latest_date = df_act['created_at'].max()
    df_act['age_days'] = (latest_date - df_act['created_at']).dt.days
    df_act['owner_encoded'] = pd.factorize(df_act['owner_id'])[0]
    df_act['is_public_num'] = df_act['is_public'].astype(int)

    # 3. Create feature matrix and normalize
    X = df_act[['owner_encoded', 'is_public_num', 'age_days']].values
    scaler = StandardScaler()
    X_normalized = scaler.fit_transform(X)

    # 4. Build user profile
    user_liked_indices = []
    weights = []
    for activity_id, score in engagement_scores.items():
        idx = df_act[df_act['id'] == activity_id].index
        if len(idx) > 0:
            user_liked_indices.append(idx[0])
            weights.append(score)

    if len(user_liked_indices) == 0:
        # User has no interactions, return newest activities
        return df_act.sort_values('created_at', ascending=False).head(top_n)

    user_profile = np.average(X_normalized[user_liked_indices], axis=0, weights=weights)

    # 5. Calculate similarities
    user_similarities = cosine_similarity([user_profile], X_normalized)[0]
    df_act['similarity_score'] = user_similarities

    # 6. Filter unseen activities and return top N
    engaged_ids = set(engagement_scores.keys())
    unseen = df_act[~df_act['id'].isin(engaged_ids)]
    recommendations = unseen.sort_values('similarity_score', ascending=False).head(top_n)

    return recommendations[['id', 'owner_id', 'age_days', 'similarity_score', 'is_public']]
