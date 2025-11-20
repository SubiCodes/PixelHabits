import { create } from 'zustand'
import axios from 'axios';
import { Activity } from './useActivityStore';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});

interface ActivityFeedStore {
    activityFeed: Activity[];
    getActivityFeed: (userId: string) => Promise<void>;
    gettingActivityFeed: boolean;
}

export const useActivityFeedStore = create<ActivityFeedStore>((set) => ({
    activityFeed: [],
    gettingActivityFeed: false,
    getActivityFeed: async (userId: string) => {
        try {
            set({ gettingActivityFeed: true });
        } catch (error) {

        } finally {
            set({ gettingActivityFeed: false });
        }
    }
}));
