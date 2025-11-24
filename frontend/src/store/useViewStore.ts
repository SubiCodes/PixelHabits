import { create } from 'zustand'
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});

interface ViewStore {
    viewing: boolean;
    setViewed: (activityId: string, userId: string) => Promise<void>
}

export const useViewStore = create<ViewStore>((set) => ({
    viewing: false,
    setViewed: async (activityId: string, userId: string) => {
        try {
            const view = await api.post(`/view`, { activity_id: activityId,  owner_id: userId });
            console.log(view.data);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                console.error(message || 'Failed to set view', {
                    id: 'set-view',
                    description: suggestion || 'Please try again later',
                });
            } else {
                console.error('Failed to set view');
            }
        }
    }
}));
