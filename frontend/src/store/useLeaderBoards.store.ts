import { create } from 'zustand'
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});

export interface LeaderBoardType {
    id: string;
    type: "interaction" | "streak";
    userIds: string[];
    amounts: number[];
    updatedAt: string | Date;
}

interface LeaderBoardStore {
    interactionLeaders: LeaderBoardType | null
    streakLeaders: LeaderBoardType | null
    gettingLeaderBoards: boolean
    getLeaderBoards: () => Promise<void>
    gettingLeaderBoardsError: string | null
}