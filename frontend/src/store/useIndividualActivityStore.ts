import { create } from 'zustand'
import axios from 'axios';
import { toast } from 'sonner';
import { Activity } from './useActivityStore';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});

interface IndividualActivityStore {
    activity: Activity | null
    gettingActivity: boolean
    getActivityById: (activityId: string) => Promise<void>
}

export const useIndividualActivityStore = create<IndividualActivityStore>((set) => ({
    activity: null,
    gettingActivity: false,
    getActivityById: async (activityId: string) => {
        try {
            set({ gettingActivity: true });
            const res = await api.get(`/activities/${activityId}`);
            set({ activity: res.data });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Unable to get activity.', {
                    id: 'get',
                    description: suggestion || 'Please try again',
                });
            } else {
                toast.error('Unable to get activity.', {
                    id: 'get',
                    description: 'Unable to get activity.',
                });
            }
        } finally {
            set({ gettingActivity: false });
        }
    }
}))
