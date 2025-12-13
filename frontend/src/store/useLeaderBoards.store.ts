import { create } from 'zustand'
import axios from 'axios';
import { toast } from 'sonner';
import { User } from './useProfileStore';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});

export interface LeaderBoardType {
    id: string;
    type: "interaction" | "streak";
    userIds: string[];
    amounts: number[];
    users: User[];
    updatedAt: string | Date;
};

interface LeaderBoardStore {
    interactionLeaders: LeaderBoardType | null
    streakLeaders: LeaderBoardType | null
    gettingLeaderBoards: boolean
    getLeaderBoards: () => Promise<void>
    gettingLeaderBoardsError: string | null
};

export const useLeaderBoardStore = create<LeaderBoardStore>((set) => ({
    interactionLeaders: null,
    streakLeaders: null,
    gettingLeaderBoards: false,
    gettingLeaderBoardsError: null,
    getLeaderBoards: async () => {
        try {
            set({ gettingLeaderBoards: true, gettingLeaderBoardsError: null });
            const res = await api.get('/leaderboards');
            set({ 
                interactionLeaders: res.data.interaction,
                streakLeaders: res.data.streak,
            });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Unable to get leaderboards.', {
                    id: 'get',
                    description: suggestion || 'Please try again later',
                });
                set({ gettingLeaderBoardsError: message || 'Unable to get leaderboards.' });
            } else {
                toast.error('Unable to get leaderboards.', {
                    id: 'get',
                    description: 'Unable to get leaderboards.',
                });
                set({ gettingLeaderBoardsError: 'Unable to get leaderboards.' });
            }
        } finally {
            set({ gettingLeaderBoards: true });
        }
    },
}));