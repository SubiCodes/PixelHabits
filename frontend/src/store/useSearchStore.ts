import { create } from 'zustand'
import axios from 'axios';
import { toast } from 'sonner';
import { User } from './useProfileStore';
import { Habit } from './useHabitStore';
import { Activity } from './useActivityStore';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});

interface SearchStore {
    getRecentSearches: (id: string) => Promise<void>
    gettingRecentSearches: boolean
    recentSearches: string[],
    getSuggestions: (searchText: string) => Promise<void>
    gettingSuggestions: boolean
    suggestions: string[]
    createSearch: (id: string, searches: string[]) => Promise<void>
    creartingSearch: boolean
    removeSearch: (id: string, searchTerm: string) => Promise<void>
    gettingSearchResults: boolean
    getSearchResults: (searchText: string) => Promise<{ users: User[], habits: Habit[], activities: Activity[] } | void>
    getSearchResultsError: string | null
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
    suggestions: [],
    gettingSuggestions: false,
    getSuggestions: async (searchText: string) => {
        try {
            set({ gettingSuggestions: true });
            const res = await api.get(`/search/suggestions/${searchText}`);
            set({ suggestions: res.data });
        } catch (error) { }
        finally {
            set({ gettingSuggestions: false });
        }
    },
    creartingSearch: false,
    createSearch: async (id: string, searches: string[]) => {
        try {
            set({ creartingSearch: true });
            const res = await api.post(`/search`, { userId: id, searches: searches });
            set({ recentSearches: res.data });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Unable to search.', {
                    id: 'create_search',
                    description: suggestion || 'Please try again later',
                });
            } else {
                toast.error('Unable to search.', {
                    id: 'create_search',
                    description: 'Unable to search.',
                });
            }
        }
        finally {
            set({ creartingSearch: false });
        }
    },
    removeSearch: async (id: string, searchTerm: string) => {
        try {
            // Optimistically update UI
            set((state) => ({
                recentSearches: state.recentSearches.filter(term => term !== searchTerm)
            }));

            await api.delete(`/search/${id}`, { data: { searchTerm } });
        } catch (error) {
            toast.error('Unable to remove search.', {
                id: 'remove_search',
                description: 'Please try again later',
            });
        }
    },
    gettingSearchResults: false,
    getSearchResults: async (searchText: string) => {
        try {
            set({ gettingSearchResults: true });
            const res = await api.get(`/search/results/${searchText}`);
            set({ getSearchResultsError: res.data });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Unable to get search results.', {
                    id: 'get_search_results',
                    description: suggestion || 'Please try again later',
                });
            } else {
                toast.error('Unable to get search results.', {
                    id: 'get_search_results',
                    description: 'Please try again later.',
                });
            }
        } finally {
            set({ gettingSearchResults: false });
        }
    },
    getSearchResultsError: null,
}));