import { create } from 'zustand'
import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});

interface LikeStore {
    like: (activity_id: string, owner_id: string) => Promise<boolean>
}

export const useLikeStore = create<LikeStore>((set) => ({
    like: async (activity_id: string, owner_id: string) => {
        try {
            const response = await api.post('/likes', {
                owner_id,
                activity_id
            });
            return response.data.liked;
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Unable to like this activity.', {
                    id: 'like',
                    description: suggestion || 'Please try again later',
                });
            } else {
                toast.error('Unable to like this activity.', {
                    id: 'like',
                    description: 'Unable to like this activity.',
                });
            }
        }
    }
}))