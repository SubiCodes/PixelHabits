import { create } from 'zustand'
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
});

interface ViewStore {
    viewContent: (activityId: string, userId: string) => Promise<void>
}

export const useViewStore = create<ViewStore>((set) => ({
    viewContent: async (activityId: string, userId: string) => {
        try {
            const view = await api.post(`/views`, { activity_id: activityId,  owner_id: userId });
        } catch (err) {
        }
    }
}));
