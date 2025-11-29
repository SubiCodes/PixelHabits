import { create } from 'zustand'
import axios from 'axios';
import { toast } from 'sonner';
import { se } from 'date-fns/locale';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});

export interface Comment {
    id: string;
    ownerId: string;
    owner?: {
        id: string;
        name: string;
        email: string;
        profileImageUrl: string;
    }
    activityId: string;
    commentText: string;
    comment_likes?: string[]; // Array of ownerIds who liked the comment
    comment_replies?: string[]; // Array of ownerIds who replied to the comment
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface Reply {
    id: string;
    commentId: string;
    ownerId: string;
    owner?: {
        id: string;
        name: string;
        email: string;
        profileImageUrl: string;
    };
    replyText: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}

interface CommentStore {
    activityComments: Comment[];
    gettingActivityComments: boolean;
    getCommentsByActivityId: (activityId: string) => Promise<void>;
    gettingActivityCommentsError: string | null;
    addComment: (activityId: string, ownerId: string, commentText: string) => Promise<void>;
    addingComment: boolean;
    removeComment: (commentId: string) => Promise<void>;
    removingComment: boolean;
    likeComment: (commentId: string, ownerId: string) => Promise<void>;
    openedCommentsId: string[];
    handleOpenCloseCommentReply: (commentId: string) => void;
    commentReplies: { commentId: string; replies: Reply[] }[];
    gettingCommentReplies: string[];
    getCommentReplies: (commentId: string) => Promise<void>;
    clearOpenedCommentsAndReplies: () => void;
}

export const useCommentStore = create<CommentStore>((set, get) => ({
    activityComments: [],
    gettingActivityComments: false,
    getCommentsByActivityId: async (activityId: string) => {
        try {
            set({ gettingActivityComments: true, gettingActivityCommentsError: null });
            const res = await api.get("/comments", { params: { activityId: activityId } });
            set({ activityComments: res.data });
        } catch (err) {
            console.log('API response (error):', err);
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Failed to get activity comments', {
                    id: 'get-activity-comments',
                    description: suggestion || 'Please try again later',
                });
                set({ gettingActivityCommentsError: message || 'Failed to get activity comments' });
            } else {
                toast.error('Failed to get activity comments', {
                    id: 'get-activity-comments',
                    description: 'An unexpected error occurred',
                });
                set({ gettingActivityCommentsError: 'Failed to get activity comments' });
            }
        } finally {
            set({ gettingActivityComments: false });
        }
    },
    gettingActivityCommentsError: null,
    addComment: async (activityId: string, ownerId: string, commentText: string) => {
        try {
            set({ addingComment: true });
            const res = await api.post("/comments", {
                activity_id: activityId,
                owner_id: ownerId,
                comment_text: commentText,
            });
            set((state) => ({ activityComments: [...state.activityComments, res.data] }));
        } catch (err) {
            console.log('API response (error):', err);
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Failed to add comment', {
                    id: 'add-activity-comments',
                    description: suggestion || 'Please try again later',
                });
                set({ gettingActivityCommentsError: message || 'Failed to add comment' });
            } else {
                toast.error('Failed to add comment', {
                    id: 'add-activity-comments',
                    description: 'An unexpected error occurred',
                });
                set({ gettingActivityCommentsError: 'Failed to add comment' });
            }
        } finally {
            set({ addingComment: true });
        }
    },
    addingComment: false,
    removeComment: async (commentId: string) => {
        try {
            set({ removingComment: true });
            toast.loading('Removing comment...', { id: 'remove-comment', description: 'Please wait while your comment is being removed.' });
            await api.delete(`/comments/${commentId}`);
            set((state) => ({ activityComments: state.activityComments.filter(comment => comment.id !== commentId) }));
            toast.success('Comment removed successfully', { id: 'remove-comment', description: 'Your comment was successfully removed.' });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Failed to delete comment', {
                    id: 'remove-comments',
                    description: suggestion || 'Please try again later',
                });
                set({ gettingActivityCommentsError: message || 'Failed to delete comment' });
            } else {
                toast.error('Failed to delete comment', {
                    id: 'remove-comments',
                    description: 'An unexpected error occurred',
                });
                set({ gettingActivityCommentsError: 'Failed to delete comment' });
            }
        } finally {
            set({ removingComment: false });
        }
    },
    removingComment: false,
    likeComment: async (commentId: string, ownerId: string) => {
        try {
            set((state) => ({
                activityComments: state.activityComments.map(comment =>
                    comment.id === commentId
                        ? {
                            ...comment,
                            comment_likes: comment.comment_likes?.includes(ownerId)
                                ? comment.comment_likes.filter(id => id !== ownerId)
                                : [...(comment.comment_likes || []), ownerId]
                        }
                        : comment
                )
            }));
            const res = await api.post("/comment-likes", {
                owner_id: ownerId,
                comment_id: commentId,
            });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Failed to like comment', {
                    id: 'like-comment',
                    description: suggestion || 'Please try again later',
                });
                set({ gettingActivityCommentsError: message || 'Failed to like comment' });
            } else {
                toast.error('Failed to like comment', {
                    id: 'like-comment',
                    description: 'An unexpected error occurred',
                });
                set({ gettingActivityCommentsError: 'Failed to like comment' });
            }
        }
    },
    openedCommentsId: [],
    handleOpenCloseCommentReply: (commentId: string) => set((state) => ({
        openedCommentsId: state.openedCommentsId.includes(commentId)
            ? state.openedCommentsId.filter(id => id !== commentId)
            : [...state.openedCommentsId, commentId]
    })),
    commentReplies: [],
    gettingCommentReplies: [],
    getCommentReplies: async (commentId: string) => {
        try {
            set((state) => ({
                gettingCommentReplies: [...state.gettingCommentReplies, commentId]
            }));
            const res = await api.get("/replies", { params: { commentId: commentId } });
            set((state) => ({
                commentReplies: [
                    ...state.commentReplies.filter(cr => cr.commentId !== commentId), { commentId, replies: res.data }
                ]
            }));
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data) {
                const { message, suggestion } = err.response.data;
                toast.error(message || 'Failed to get replies', {
                    id: 'get-reply',
                    description: suggestion || 'Please try again later',
                });
                set({ gettingActivityCommentsError: message || 'Failed to get replies' });
            } else {
                toast.error('Failed to get replies', {
                    id: 'get-reply',
                    description: 'An unexpected error occurred',
                });
                set({ gettingActivityCommentsError: 'Failed to get replies' });
            }
        } finally {
            set((state) => ({
                gettingCommentReplies: state.gettingCommentReplies.filter(id => id !== commentId)
            }));
        }
    },
    clearOpenedCommentsAndReplies: () => {
        set(() => ({openedCommentsId: [], commentReplies: [], gettingCommentReplies: []}));
    }
}))