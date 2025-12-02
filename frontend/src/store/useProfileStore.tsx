import { create } from 'zustand'
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
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
}

interface ProfileStore {
    userProfile: User | null;

};

export const useProfileStore = create<ProfileStore>((set) => ({
    userProfile: null,
}));