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
        } catch (error) {
            
        }
    },
    gettingActivityCommentsError: null,
}))