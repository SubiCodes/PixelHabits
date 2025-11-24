import { create } from 'zustand'
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});

interface ViewStore {
    viewContent: (activityId: string, userId: string) => Promise<void>
}

export const useViewStore = create<ViewStore>((set) => ({
    viewContent: async (activityId: string, userId: string) => {
        try {
            console.log(`Setting view for activity ${activityId} by user ${userId}`);
            const view = await api.post(`/views`, { activity_id: activityId,  owner_id: userId });
            console.log(view.data);
        } catch (err) {
        }
    }
}));
