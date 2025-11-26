import { create } from 'zustand'
import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});

export interface Comments {
    id: string;
    ownerId: string;
    owner?: {
        id: string;
        name: string;
        email: string;
        profileImageUrl: string;
    }
    activityId: string;
    commentText: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}

interface CommentStore {
    activityComments: Comments[];
    gettingActivityComments: boolean;
    getCommentsByActivityId: (activityId: string) => Promise<void>;
    gettingActivityCommentsError: string | null;
}

export const useCommentStore = create<CommentStore>((set, get) => ({
    activityComments: [],
    gettingActivityComments: false,
    getCommentsByActivityId: async (activityId: string) => {
        try {
            set({ gettingActivityComments: true, gettingActivityCommentsError: null });
            const res = await api.get("/comments", { params: { activityId: activityId } });
            set({ activityComments: res.data });
        } catch (err) {
            console.log('API response (error):', err);
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Failed to get activity comments', {
                    id: 'get-activity-comments',
                    description: suggestion || 'Please try again later',
                });
                set({ gettingActivityCommentsError: message || 'Failed to get activity comments' });
            } else {
                toast.error('Failed to get activity comments', {
                    id: 'get-activity-comments',
                    description: 'An unexpected error occurred',
                });
                set({ gettingActivityCommentsError: 'Failed to get activity comments' });
            }
        } finally {
            set({ gettingActivityComments: false });
        }
    },
    gettingActivityCommentsError: null,
}))