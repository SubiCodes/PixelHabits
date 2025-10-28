import { create } from 'zustand'
import axios from 'axios';
import { toast } from 'sonner';

// Set base URL for axios
const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});

export interface Activity {
    id: string;
    createdAt: string | Date;
    // Add other fields as needed
}

export interface Habit {
    id: string;
    ownerId: string;
    title: string;
    description: string;
    isPublic: boolean;
    createdAt: Date;
    activities?: Activity[];
}

export type PartialHabit = Partial<Omit<Habit, 'id' | 'ownerId' | 'createdAt'>>
interface HabitStore {
    habits: Habit[]
    gettingUserHabits: boolean
    getHabitsByUserId: (ownerId: string, requestingUserId: string) => Promise<void>
    addingHabit: boolean
    addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => Promise<void>
    editingHabit: boolean
    editHabit: (habit: PartialHabit, habitId: string) => Promise<void>
    deletingHabit: boolean
    deleteHabit: (habitId: string) => Promise<void>
}

// Create the store
export const useHabitStore = create<HabitStore>((set) => ({
    habits: [],

    gettingUserHabits: false,
    getHabitsByUserId: async (ownerId: string, requestingUserId: string) => {
        try {
            set({ gettingUserHabits: true });
            const res = await api.get(`/habits?ownerId=${ownerId}&requestingUserId=${requestingUserId}`);
            set({ habits: res.data });
        } catch (error) {
            toast.error('Failed to fetch habits', {
                description: 'An unexpected error occurred',
            });
        } finally {
            set({ gettingUserHabits: false });
        }
    },

    addingHabit: false,
    addHabit: async (habit) => {
        try {
            set({ addingHabit: true });
            toast.loading('Creating habit...', { id: 'create-habit' });
            const res = await api.post('/habits', habit);
            set((state) => ({ habits: [...state.habits, res.data] }));
            toast.success('Habit created successfully!', { id: 'create-habit' });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                const { message, suggestion } = error.response.data;
                toast.error(message || 'Failed to create habit', {
                    id: 'create-habit',
                    description: suggestion || 'Please try again later',
                });
            } else {
                toast.error('Failed to create habit', {
                    id: 'create-habit',
                    description: 'An unexpected error occurred',
                });
            }
            throw error;
        } finally {
            set({ addingHabit: false });
        }
    },

    editingHabit: false,
    editHabit: async (habit: PartialHabit, habitId: string) => {
        try {
            set({ editingHabit: true });
            toast.loading('Updating habit...', { id: 'edit-habit' });
            const res = await api.patch(`/habits/${habitId}`, habit);
            set((state) => ({
                habits: state.habits.map((h) => (h.id === habitId ? res.data : h)),
            }));
            toast.success('Habit updated successfully!', { id: 'edit-habit' });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                const { message, suggestion } = error.response.data;
                toast.error(message || 'Failed to update habit', {
                    id: 'edit-habit',
                    description: suggestion || 'Please try again later',
                });
            } else {
                toast.error('Failed to update habit', {
                    id: 'edit-habit',
                    description: 'An unexpected error occurred',
                });
            }
            throw error;
        } finally {
            set({ editingHabit: false });
        }
    },

    deletingHabit: false,
    deleteHabit: async (habitId: string) => {
        try {
            set({ deletingHabit: true });
            toast.loading('Deleting habit...', { id: 'delete-habit' });
            await api.delete(`/habits/${habitId}`);
            set((state) => ({
                habits: state.habits.filter((h) => h.id !== habitId),
            }));
            toast.success('Habit deleted successfully!', { id: 'delete-habit' });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                const { message, suggestion } = error.response.data;
                toast.error(message || 'Failed to delete habit', {
                    id: 'delete-habit',
                    description: suggestion || 'Please try again later',
                });
            } else {
                toast.error('Failed to delete habit', {
                    id: 'delete-habit',
                    description: 'An unexpected error occurred',
                });
            }
            throw error;
        } finally {
            set({ deletingHabit: false });
        }
    }
}))
