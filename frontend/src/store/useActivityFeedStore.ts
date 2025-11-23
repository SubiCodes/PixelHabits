import { create } from 'zustand'
import axios from 'axios';
import { Activity } from './useActivityStore';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});

interface ActivityFeedStore {
    activityFeed: Activity[];
    getActivityFeed: (userId: string) => Promise<void>;
    gettingFeedError: string | null;
    gettingActivityFeed: boolean;
}

export const useActivityFeedStore = create<ActivityFeedStore>((set) => ({
    activityFeed: [],
    gettingActivityFeed: false,
    gettingFeedError: null,
    getActivityFeed: async (userId: string) => {
        try {
            set({ gettingActivityFeed: true, gettingFeedError: null });
            const feed = await api.post(`/contents/${userId}`);
            console.log(feed.data)
            set({ activityFeed: feed.data });
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
    }
}));
