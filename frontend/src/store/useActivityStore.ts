import { create } from 'zustand'
import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});


export interface Activity {
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
    habitId: string;
    caption: string;
    mediaUrls: (string | File)[];
    isPublic: boolean;
    likes: string[]; // Array of ownerIds who liked the activity
    comments: number; // Number of comments
    createdAt: string | Date;
    updatedAt: string | Date;
}

// For uploading (no id, ownerId, createdAt, updatedAt)
export type PartialActivity = Partial<Omit<Activity, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>> & {
    habitId: string;
}

interface ActivityStore {
    addingActivity: boolean;
    addActivity: (activity: FormData) => Promise<void>;
    editActivity: (activityId: string, activity: Activity, mediasToDelete: string[], fromProfile?: boolean) => Promise<void>;
    editingActivity: boolean;
    deleteActivity: (activityId: string, fromProfile?: boolean) => Promise<void>;
    deletingActivity: boolean;
    habitActivities: Activity[];
    gettingActivities: boolean;
    getActivitiesByHabitId: (habitId: string, userId: string) => Promise<void>;
    gettingActivitiesError: boolean;
    isUserLiked: (activityId: string, userId: string) => boolean;
    likeActivity: (activityId: string, userId: string, addLike: boolean) => void;
    getUserActivities: (userId: string, requestingUserId: string) => Promise<void>;
    userActivities: Activity[];
    gettingUserActivities: boolean;
    gettingUserActivitiesError: string | null;
    likeActivityOnUserActivities: (activityId: string, userId: string, addLike: boolean) => void;
    isUserLikedUserActivity: (activityId: string, userId: string) => boolean;
}

export const useActivityStore = create<ActivityStore>((set, get) => ({
    addingActivity: false,
    addActivity: async (activity: FormData) => {
        try {
            set({ addingActivity: true });
            toast.loading('Adding activity...', { id: 'add-activity', description: 'Please wait while your activity is being added.' });
            const activityJson = activity.get('activity') as string;
            const habitId = activityJson ? JSON.parse(activityJson).habitId : '';
            const res = await api.post('/activities', activity, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Activity added', { id: 'add-activity', description: 'Your activity has been added successfully.' });
            const { useHabitStore } = await import('./useHabitStore');
            useHabitStore.getState().addActivityToHabit(habitId, res.data);
        } catch (err) {
            console.log('API response (error):', err);
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Failed to add activity', {
                    id: 'add-activity',
                    description: suggestion || 'Please try again later',
                });
            } else {
                toast.error('Failed to add activity', {
                    id: 'add-activity',
                    description: 'An unexpected error occurred',
                });
            }
        } finally {
            set({ addingActivity: false });
        }
    },
    editingActivity: false,
    editActivity: async (activityId: string, activity: Activity, mediasToDelete: string[], fromProfile: boolean = false) => {
        try {
            set({ editingActivity: true });
            toast.loading('Editing activity...', { id: 'edit-activity' });
            const mediaFiles: File[] = [];
            const mediaUrlsPayload = activity.mediaUrls.map((media) => {
                if (media instanceof File) {
                    mediaFiles.push(media);
                    return '0';
                }
                return media as string;
            });

            const form = new FormData();
            const activityPayload = {
                caption: activity.caption,
                isPublic: activity.isPublic,
                mediaUrls: mediaUrlsPayload,
                mediaUrlsToDelete: mediasToDelete,
            };
            form.append('activity', JSON.stringify(activityPayload));
            for (const file of mediaFiles) {
                form.append('files', file);
            }
            const res = await api.patch(`/activities/${activityId}`, form);

            if (fromProfile) {
                set((state) => ({
                    userActivities: state.userActivities.map((activity) =>
                        activity.id === activityId ? res.data : activity
                    ),
                }));
            } else {
                set((state) => ({
                    habitActivities: state.habitActivities.map((activity) =>
                        activity.id === activityId ? res.data : activity
                    ),
                }));
            }

            toast.success('Activity updated successfully', {
                id: 'edit-activity',
                description: 'Your changes have been saved'
            });

        } catch (err) {
            console.log('API response (error):', err);
            set({ gettingActivitiesError: true });
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Failed to edit activity', {
                    id: 'edit-activity',
                    description: suggestion || 'Please try again later',
                });
            } else {
                toast.error('Failed to edit activity', {
                    id: 'edit-activity',
                    description: 'An unexpected error occurred',
                });
            }
        } finally {
            set({ editingActivity: false });
        }
    },
    deletingActivity: false,
    deleteActivity: async (activityId: string, fromProfile: boolean = false) => {
        try {
            set({ deletingActivity: true });
            toast.loading('Deleting activity...', { id: 'delete-activity' });
            await api.delete(`/activities/${activityId}`);
            
            if (fromProfile) {
                set((state) => ({
                    userActivities: state.userActivities.filter((activity) => activity.id !== activityId),
                }));
            } else {
                set((state) => ({
                    habitActivities: state.habitActivities.filter((activity) => activity.id !== activityId),
                }));
            }
            toast.success('Activity deleted successfully', { id: 'delete-activity', description: 'Activity successfully removed.' });
        } catch (err) {
            console.log('API response (error):', err);
            set({ gettingActivitiesError: true });
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Failed to delete activity', {
                    id: 'delete-activity',
                    description: suggestion || 'Please try again later',
                });
            } else {
                toast.error('Failed to delete activity', {
                    id: 'delete-activity',
                    description: 'An unexpected error occurred',
                });
            }
        } finally {
            set({ deletingActivity: false });
        }
    },
    habitActivities: [],
    gettingActivities: false,
    getActivitiesByHabitId: async (habitId: string, userId: string) => {
        try {
            set({ gettingActivities: true, gettingActivitiesError: false });
            const res = await api.get(`/activities?habitId=${habitId}&requestingUserId=${userId}`);
            set({ habitActivities: res.data });
        } catch (err) {
            console.log('API response (error):', err);
            set({ gettingActivitiesError: true });
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Failed to get activities', {
                    id: 'get-activities',
                    description: suggestion || 'Please try again later',
                });
            } else {
                toast.error('Failed to get activities', {
                    id: 'create-habit',
                    description: 'An unexpected error occurred',
                });
            };
        } finally {
            set({ gettingActivities: false });
        }
    },
    gettingActivitiesError: false,
    likeActivity: (activityId: string, userId: string, addLike: boolean) => {
        set((state) => ({
            habitActivities: state.habitActivities.map(activity => {
                if (activity.id !== activityId) return activity;
                const likes = Array.isArray(activity.likes) ? activity.likes : [];
                if (addLike) {
                    // Add userId if not already present
                    return {
                        ...activity,
                        likes: likes.includes(userId) ? likes : [...likes, userId]
                    };
                } else {
                    // Remove userId if present
                    return {
                        ...activity,
                        likes: likes.filter(id => id !== userId)
                    };
                }
            })
        }));
    },
    isUserLiked: (activityId: string, userId: string) => {
        const activity = get().habitActivities.find(act => act.id === activityId);
        if (!activity || !Array.isArray(activity.likes)) return false;
        return activity.likes.includes(userId);
    },
    getUserActivities: async (userId: string, requestingUserId: string) => {
        try {
            set({ gettingUserActivities: true, gettingUserActivitiesError: null  });
            const res = await api.get(`/activities/user/${userId}`, {
                params: { requestingUserId }
            });
            set({ userActivities: res.data });
        } catch (err) {
            console.log('API response (error):', err);
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Failed to get activities', {
                    id: 'get-user-activities',
                    description: suggestion || 'Please try again later',
                });
                set({ gettingUserActivitiesError: message || 'Failed to get activities' });
            } else {
                toast.error('Failed to get activities', {
                    id: 'get-user-activities',
                    description: 'An unexpected error occurred',
                });
                set({ gettingUserActivitiesError: 'Failed to get activities' });
            };
        } finally {
            set({ gettingUserActivities: false });
        }
    },
    userActivities: [],
    gettingUserActivities: false,
    gettingUserActivitiesError: null,
    likeActivityOnUserActivities: (activityId: string, userId: string, addLike: boolean) => {
        set((state) => ({
            userActivities: state.userActivities.map(activity => {
                if (activity.id !== activityId) return activity;
                const likes = Array.isArray(activity.likes) ? activity.likes : [];
                if (addLike) {
                    // Add userId if not already present
                    return {
                        ...activity,
                        likes: likes.includes(userId) ? likes : [...likes, userId]
                    };
                } else {
                    // Remove userId if present
                    return {
                        ...activity,
                        likes: likes.filter(id => id !== userId)
                    };
                }
            })
        }));
    },
    isUserLikedUserActivity: (activityId: string, userId: string) => {
        const activity = get().userActivities.find(act => act.id === activityId);
        if (!activity || !Array.isArray(activity.likes)) return false;
        return activity.likes.includes(userId);
    },
}))