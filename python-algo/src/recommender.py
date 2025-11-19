
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler


def _handle_cold_start(df_activities, strategy='popular', top_n=10):
    """
    Handle cold start problem for new users with no interaction history
    
    Parameters:
    - df_activities: DataFrame of all activities
    - strategy: 'newest', 'popular', or 'random'
    - top_n: Number of recommendations to return
    
    Returns: DataFrame with recommendations
    """
    df = df_activities.copy()
    
    if strategy == 'newest':
        # Return newest public activities
        result = df[df['is_public'] == True].sort_values('created_at', ascending=False).head(top_n)
        
    elif strategy == 'popular':
        # Return most engaging activities (would need engagement counts from DB)
        # For now, prioritize public activities with recent dates
        result = df[df['is_public'] == True].sort_values('created_at', ascending=False).head(top_n)
        
    elif strategy == 'random':
        # Random selection of public activities
        result = df[df['is_public'] == True].sample(n=min(top_n, len(df)))
        
    else:
        # Default to newest
        result = df[df['is_public'] == True].sort_values('created_at', ascending=False).head(top_n)
    
    # Add a default similarity score for consistency
    result['similarity_score'] = 0.0
    
    return result[['id', 'owner_id', 'age_days', 'similarity_score', 'is_public']]


def get_recommendations(df_activities, df_likes, df_views, df_comments, user_id, top_n=10, cold_start_strategy='popular'):
    """
    Get personalized recommendations for a user using Content-Based Filtering

    Parameters:
    - df_activities: DataFrame of ALL activities in the system
    - df_likes: DataFrame of user's likes
    - df_views: DataFrame of user's views
    - df_comments: DataFrame of user's comments
    - user_id: The user to generate recommendations for
    - top_n: Number of recommendations to return
    - cold_start_strategy: Strategy for new users ('newest', 'popular', 'random')
        - 'newest': Return most recent activities
        - 'popular': Return activities with most engagement (likes/comments)
        - 'random': Return random selection

    Returns: DataFrame with top N recommended activities
    """

    # 1. Calculate engagement scores (FILTER BY USER!)
    engagement_scores = {}
    
    # Filter by the specific user
    user_views = df_views[df_views['owner_id'] == user_id]
    user_likes = df_likes[df_likes['owner_id'] == user_id]
    user_comments = df_comments[df_comments['owner_id'] == user_id]
    
    print(f"DEBUG recommender: User {user_id} has {len(user_views)} views, {len(user_likes)} likes, {len(user_comments)} comments")
    
    for _, row in user_views.iterrows():
        engagement_scores[row['activity_id']] = engagement_scores.get(row['activity_id'], 0) + 1
    for _, row in user_likes.iterrows():
        engagement_scores[row['activity_id']] = engagement_scores.get(row['activity_id'], 0) + 2
    for _, row in user_comments.iterrows():
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
        # COLD START: User has no interactions
        return _handle_cold_start(df_act, cold_start_strategy, top_n)

    user_profile = np.average(X_normalized[user_liked_indices], axis=0, weights=weights)

    # 5. Calculate similarities
    user_similarities = cosine_similarity([user_profile], X_normalized)[0]
    df_act['similarity_score'] = user_similarities

    # 6. Filter unseen activities and return top N
    engaged_ids = set(engagement_scores.keys())
    print(f"DEBUG recommender: Total activities: {len(df_act)}")
    print(f"DEBUG recommender: Engaged activities: {len(engaged_ids)}")
    
    unseen = df_act[~df_act['id'].isin(engaged_ids)]
    print(f"DEBUG recommender: Unseen activities: {len(unseen)}")
    
    recommendations = unseen.sort_values('similarity_score', ascending=False).head(top_n)
    print(f"DEBUG recommender: Final recommendations: {len(recommendations)}")

    return recommendations[['id', 'owner_id', 'age_days', 'similarity_score', 'is_public']]
