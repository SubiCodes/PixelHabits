import { create } from 'zustand'
import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});


export interface Activity {
    id: string;
    ownerId: string;
    habitId: string;
    caption: string;
    mediaUrls: (string | File)[];
    isPublic: boolean;
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
    editActivity: (activityId: string, activity: Activity, mediasToDelete: string[]) => Promise<void>;
    editingActivity: boolean;
    habitActivities: Activity[];
    gettingActivities: boolean;
    getActivitiesByHabitId: (habitId: string, userId: string) => Promise<void>;
    gettingActivitiesError: boolean;
}

export const useActivityStore = create<ActivityStore>((set) => ({
    addingActivity: false,
    addActivity: async (activity: FormData) => {
        try {
            set({ addingActivity: true });
            toast.loading('Adding activity...', { id: 'add-activity' });
            const activityJson = activity.get('activity') as string;
            const habitId = activityJson ? JSON.parse(activityJson).habitId : '';
            const res = await api.post('/activities', activity, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('API response (success):', res);
            console.log('PASSED DATA:', activity);
            toast.success('Activity added', { id: 'add-activity' });
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
    editActivity: async (activityId: string, activity: Activity, mediasToDelete: string[]) => {
        try {
            set({ editingActivity: true });
            toast.loading('Editing activity...', { id: 'edit-activity' });

            // Step 1: Collect File objects and create a payload with placeholders
            // Files are marked as '0' so the server knows which positions need replacement
            const mediaFiles: File[] = [];
            const mediaUrlsPayload = activity.mediaUrls.map((media) => {
                if (media instanceof File) {
                    // Collect the File object to send separately
                    mediaFiles.push(media);
                    // Return placeholder '0' so server knows a file goes here
                    return '0';
                }
                // Keep existing URL strings unchanged
                return media as string;
            });

            // Step 2: Build FormData for multipart/form-data request
            const form = new FormData();

            // Append the activity JSON with placeholder mediaUrls
            // Only include fields that the backend UpdateActivityDto expects
            const activityPayload = {
                caption: activity.caption,
                isPublic: activity.isPublic,
                mediaUrls: mediaUrlsPayload,
                mediaUrlsToDelete: mediasToDelete,
            };
            form.append('activity', JSON.stringify(activityPayload));

            // Append each File object in order (server will use these to replace placeholders)
            for (const file of mediaFiles) {
                form.append('files', file);
            }

            // Step 3: Send PATCH request to update activity
            // axios will auto-detect FormData and set Content-Type with boundary
            const res = await api.patch(`/activities/${activityId}`, form);

            console.log('API response (success):', res);
            console.log('Updated activity:', res.data);
            toast.success('Activity updated', { id: 'edit-activity' });

            // TODO: Update habit store with new activity data if needed
            // const { useHabitStore } = await import('./useHabitStore');
            // useHabitStore.getState().updateActivityInHabit(activityId, res.data);

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
}))
