import { create } from 'zustand'
import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});

interface LikeStore {
    likeContent: (activityId: string, userId: string) => Promise<void>
}

export const useLikeStore = create<LikeStore>((set) => ({
    likeContent: async (activityId: string, userId: string) => {

    }
}))