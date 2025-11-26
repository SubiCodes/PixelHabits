import React, { useEffect } from 'react'

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { useMediaQuery } from '@/hooks/use-media-query';
import { useCommentStore } from '@/store/useCommentStore';
import { stat } from 'fs';
import Comment from './Comment';


interface CommentSheetProps {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    activityId: string | null;
}

function CommentSheet({ open, onOpenChange, activityId }: CommentSheetProps) {

    const isDesktop = useMediaQuery("(min-width: 768px)")

    const comments = useCommentStore((state) => state.activityComments);
    const gettingComments = useCommentStore((state) => state.gettingActivityComments);
    const getCommentsByActivityId = useCommentStore((state) => state.getCommentsByActivityId);
    const gettingCommentsError = useCommentStore((state) => state.gettingActivityCommentsError);

    const fetchComments = async () => {
        if (!activityId) return;
        console.log("Fetching for:", activityId);
        await getCommentsByActivityId(activityId);
        console.log("Comments fetched:", comments);
    }

    useEffect(() => {
        fetchComments();    
    }, [activityId]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent  side={isDesktop ? "right" : "bottom"} className={`${isDesktop ? '' : 'h-2/3'}`}>
                <SheetHeader>
                    <SheetTitle>Comments</SheetTitle>
                </SheetHeader>
                <div className='flex flex-1 flex-col gap-2'>
                    {gettingComments ? (
                        <div className="w-full min-h-full flex justify-center items-center py-8 text-muted-foreground">
                            Loading comments...
                        </div>
                    ) : gettingCommentsError ? (
                        <div className="w-full min-h-full flex justify-center items-center py-8 text-red-500">
                            Error loading comments
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="w-full min-h-full flex justify-center items-center py-8 text-muted-foreground">
                            No comments yet.
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <React.Suspense fallback={<div>Loading...</div>} key={comment.id}>
                                <Comment comment={comment} />
                            </React.Suspense>
                        ))
                    )}
                </div>
                <SheetFooter>
                    <textarea
                        className="w-full min-h-10 max-h-60 resize-y rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Write a comment..."
                        rows={2}
                    />
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

export default CommentSheet
