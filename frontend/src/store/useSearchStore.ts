import { create } from 'zustand'
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});

interface SearchStore {
    getRecentSearches: (id: string) => Promise<void>
    gettingRecentSearches: boolean
    recentSearches: string[]
}

export const useSearchStore = create<SearchStore>((set) => ({
    recentSearches: [],
    gettingRecentSearches: false,
    getRecentSearches: async (id: string) => {
        try {
            set({ gettingRecentSearches: true });
            const recents = await api.get(`/search/${id}`);
            set({ recentSearches: recents.data });
        } catch (error) { }
        finally {
            set({ gettingRecentSearches: false });
        }
    },
}));