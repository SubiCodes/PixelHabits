import { create } from 'zustand'
import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
});

export interface User {
    id: string;
    rawJson: unknown;
    name: string | null;
    email: string | null;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
    bio: string | null;
    isNew: boolean;
    habitsCount: number;
    activitiesCount: number;
    longestStreak: number;
}

interface ProfileStore {
    userProfile: User | null;
    gettingUserProfile: boolean;
    gettingUserProfileError: string | null;
    getUserProfile: (userId: string) => Promise<void>;
    updatingUserProfile: boolean;
    updateUserProfile: (userId: string, data: { bio?: string | null, isNew?: boolean | null },) => Promise<void>;
};

export const useProfileStore = create<ProfileStore>((set) => ({
    userProfile: null,
    gettingUserProfile: false,
    gettingUserProfileError: null,
    getUserProfile: async (userId: string) => {
        try {
            set({ gettingUserProfile: true });
            const response = await api.get(`/profile/${userId}`);
            set({ userProfile: response.data });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Unable to get profile.', {
                    id: 'getUserProfile',
                    description: suggestion || 'Please try again later',
                });
                set({ gettingUserProfileError: message || 'Unable to get profile.' });
            } else {
                toast.error('Unable to get profile.', {
                    id: 'getUserProfile',
                    description: 'Unable to get profile.',
                });
                set({ gettingUserProfileError: 'Unable to get profile.' });
            }
        } finally {
            set({ gettingUserProfile: false });
        }
    },
    updatingUserProfile: false,
    updateUserProfile: async (userId: string, data: { bio?: string | null, isNew?: boolean | null }) => {
        try {
            set({ updatingUserProfile: true });
            const response = await api.patch(`/profile/${userId}`, data);
            set((state) => ({
                userProfile: state.userProfile ? {
                    ...state.userProfile,
                    ...(data.bio !== null && { bio: data.bio }),
                    ...(data.isNew !== null && { isNew: data.isNew })
                } : null
            }));
            toast.success('Profile updated successfully.', {
                id: 'updateUserProfile',
            });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Unable to update profile.', {
                    id: 'updateUserProfile',
                    description: suggestion || 'Please try again later',
                });
                set({ gettingUserProfileError: message || 'Unable to update profile.' });
            } else {
                toast.error('Unable to update profile.', {
                    id: 'updateUserProfile',
                    description: 'Unable to update profile.',
                });
                set({ gettingUserProfileError: 'Unable to update profile.' });
            }
        } finally {
            set({ updatingUserProfile: false });
        }
    }
}));