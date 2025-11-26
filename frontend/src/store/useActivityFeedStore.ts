import { create } from 'zustand'
import axios from 'axios';
import { Activity } from './useActivityStore';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});

interface ActivityFeedStore {
    activityFeed: Activity[];
    getActivityFeed: (userId: string, activityIds?: string[]) => Promise<void>;
    gettingFeedError: string | null;
    gettingActivityFeed: boolean;
    likeActivity: (activityId: string, userId: string, addLike: boolean) => void;
    isUserLiked: (activityId: string, userId: string) => boolean;
}

export const useActivityFeedStore = create<ActivityFeedStore>((set, get) => ({
    activityFeed: [],
    gettingActivityFeed: false,
    gettingFeedError: null,
    getActivityFeed: async (userId: string, activityIds?: string[]) => {
        try {
            set({ gettingActivityFeed: true, gettingFeedError: null });
            const feed = await api.post(`/contents/${userId}`, { activityIds });
            console.log("Fetched feed:", feed.data);
            set((state) => ({
                activityFeed: [
                    ...state.activityFeed,
                    ...feed.data.data.filter(
                        (item: Activity) => !state.activityFeed.some((existing) => existing.id === item.id)
                    )
                ]
            }));
            if (feed.data.reusedContent) {
                toast.info('You have interacted with all available contents. Showing popular contents as recommendations.', {
                    id: 'reused-content-info'
                });
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Failed to get user feed', {
                    id: 'fetch-feed',
                    description: suggestion || 'Please try again later',
                });
                set({ gettingFeedError: message || 'Failed to get user feed' });
            } else {
                toast.error('Failed to get user feed', {
                    id: 'fetch-feed',
                    description: 'An unexpected error occurred',
                });
                set({ gettingFeedError: 'Failed to get user feed' });
            }
        } finally {
            set({ gettingActivityFeed: false });
        }
    },
    likeActivity: (activityId: string, userId: string, addLike: boolean) => {
        set((state) => ({
            activityFeed: state.activityFeed.map(activity => {
                if (activity.id !== activityId) return activity;
                const likes = Array.isArray(activity.likes) ? activity.likes : [];
                if (addLike) {
                    // Add userId if not already present
                    return {
                        ...activity,
                        likes: likes.includes(userId) ? likes : [...likes, userId]
                    };
                } else {
                    // Remove userId if present
                    return {
                        ...activity,
                        likes: likes.filter(id => id !== userId)
                    };
                }
            })
        }));
    },
    isUserLiked: (activityId: string, userId: string) => {
        const activity = get().activityFeed.find(act => act.id === activityId);
        if (!activity || !Array.isArray(activity.likes)) return false;
        return activity.likes.includes(userId);
    }
}));
