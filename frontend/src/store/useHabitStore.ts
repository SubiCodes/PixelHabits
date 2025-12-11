import { create } from 'zustand'
import axios from 'axios';
import { toast } from 'sonner';

// Set base URL for axios
const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});

export interface Activity {
    id: string;
    ownerId: string;
    habitId: string;
    caption: string | null;
    mediaUrls: (string | File)[];
    isPublic: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface Habit {
    id: string;
    ownerId: string;
    owner?: {
        id: string;
        name: string;
        email: string;
        profileImageUrl: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rawJson?: any;
        createdAt?: string;
        updatedAt?: string | null;
        deletedAt?: string | null;
        bio?: string | null;
        isNew?: boolean;
    }
    title: string;
    description: string;
    isPublic: boolean;
    createdAt: Date;
    activities?: Activity[];
    streak?: number;
}

export type PartialHabit = Partial<Omit<Habit, 'id' | 'ownerId' | 'createdAt'>>
interface HabitStore {
    habits: Habit[]
    gettingUserHabits: boolean
    getHabitsByUserId: (ownerId: string, requestingUserId: string) => Promise<void>
    habit: Habit | null
    gettingHabit: boolean
    getHabitById: (habitId: string) => Promise<void>
    getHabit: (habitId: string) => Habit | undefined
    addingHabit: boolean
    addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => Promise<void>
    editingHabit: boolean
    editHabit: (habit: PartialHabit, habitId: string, atHabitPage?: boolean) => Promise<void>
    deletingHabit: boolean
    deleteHabit: (habitId: string) => Promise<void>
    addActivityToHabit: (habitId: string, activity: Activity) => void
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
    habit: null,
    gettingHabit: false,
    getHabitById: async (habitId: string) => {
        try {
            set({ gettingHabit: true });
            const res = await api.get(`/habits/${habitId}`);
            set({ habit: res.data });
            console.log('Fetched habit:', res.data);    
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                const { message, suggestion } = error.response.data;
                toast.error(message || 'Failed to fetch habit', {
                    description: suggestion || 'Please try again later',
                });
            } else {
                toast.error('Failed to fetch habit', {
                    description: 'An unexpected error occurred',
                });
            }
            throw error;
        } finally {
            set({ gettingHabit: false });
        }
    },
    getHabit: (habitId: string): Habit | undefined => {
        const habit = useHabitStore.getState().habits.find((habit: Habit) => habit.id === habitId);
        set({ habit: habit });
        return;
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
    editHabit: async (habit: PartialHabit, habitId: string, atHabitPage?: boolean) => {
        try {
            set({ editingHabit: true });
            toast.loading('Updating habit...', { id: 'edit-habit' });
            const res = await api.patch(`/habits/${habitId}`, habit);
            if (atHabitPage) {
                set({ habit: res.data });
            } else {
                set((state) => ({
                    habits: state.habits.map((h) => (h.id === habitId ? res.data : h)),
                }));
            }
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
    },
    addActivityToHabit: (habitId, activity) => {
        set((state) => ({
            habits: state.habits.map((habit) =>
                habit.id === habitId
                    ? {
                        ...habit,
                        activities: habit.activities ? [...habit.activities, activity] : [activity],
                        streak: typeof habit.streak === 'number' ? habit.streak + 1 : 1,
                    }
                    : habit
            ),
        }));
    },
}))
