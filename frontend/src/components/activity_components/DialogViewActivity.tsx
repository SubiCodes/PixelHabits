import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { Ellipsis, X, Edit, Trash2 } from "lucide-react"
import { Activity, useActivityStore } from "@/store/useActivityStore"
import CarouselMediaWithActionButtons from "./CarouselMediaWithActionButtons"
import { useUser } from "@stackframe/stack"
import { useLikeStore } from "@/store/useLikeStore"
import CommentSheet from "./CommentSheet"
import { useCommentStore } from "@/store/useCommentStore"
import { useIndividualActivityStore } from "@/store/useIndividualActivityStore"
import LoadingPage from "@/components/LoadingPage"

interface DialogCreateHabitProps {
    open: boolean
    close: () => void
    activityId: string | null
    editFunc?: (activity: Activity | null) => void
    deleteFunc?: () => void
    handleLikeFunction?: () => void
    fromUserProfile?: boolean
    playVideo?: boolean
}

export function DialogViewActivity({ open, close, activityId, editFunc, deleteFunc, handleLikeFunction, fromUserProfile = false, playVideo = false }: DialogCreateHabitProps) {

    const user = useUser();
    const isUserLiked = useActivityStore((state) => state.isUserLiked);
    const isUserLikedUserActivity = useActivityStore((state) => state.isUserLikedUserActivity);
    const likeActivity = useActivityStore((state) => state.likeActivity);
    const like = useLikeStore((state) => state.like);
    const clearOpenedCommentsAndReplies = useCommentStore((state) => state.clearOpenedCommentsAndReplies)
    const [isCommentSheetOpen, setIsCommentSheetOpen] = useState<boolean>(false);

    const activity = useIndividualActivityStore((state) => state.activity);
    const gettingActivity = useIndividualActivityStore((state) => state.gettingActivity);
    const getActivityById = useIndividualActivityStore((state) => state.getActivityById);
    const updateActivity = useIndividualActivityStore((state) => state.updateActivity);

    useEffect(() => {
        if (open && activityId) {
            getActivityById(activityId);
        }
    }, [open, activityId]);

    useEffect(() => {
        console.log('Activity data:', activity);
        console.log('Getting activity:', gettingActivity);
    }, [activity, gettingActivity]);

    const handleLike = async (activityId: string) => {
        if (!user || !activity) return;

        console.log("triggered");
        // Create new likes array with updated values
        const newLikes = activity.likes.includes(user.id)
            ? activity.likes.filter(id => id !== user.id)
            : [...activity.likes, user.id];

        // Update activity with new likes array
        updateActivity({ ...activity, likes: newLikes });
        
        // Call API to persist the like/unlike
        like(activityId, user.id);
    };

    const handleComment = async () => {
        await clearOpenedCommentsAndReplies();
        setIsCommentSheetOpen(true);
    };

    return (
        <AlertDialog open={open} onOpenChange={close}>
            <AlertDialogContent className="pb-2 px-2 pt-0 max-w-md h-auto">
                <AlertDialogHeader className="border-b border-black grid grid-cols-3 w-full items-center py-2">
                    <div>
                        {user?.id === activity?.owner?.id && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="bg-transparent">
                                        <Ellipsis size={16} color="black" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); if (typeof editFunc === 'function') { editFunc(activity); } }}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>Edit Activity</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem variant="destructive" onSelect={(e) => { e.preventDefault(); if (typeof deleteFunc === 'function') { deleteFunc(); } }}>
                                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                        <span className="text-destructive">Delete Activity</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                    <AlertDialogTitle className="font-bold text-center">View Activity</AlertDialogTitle>
                    <div className="flex justify-end">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={close}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </AlertDialogHeader>

                {/* Media Display with Overlay */}
                <div className="relative w-full h-[600px] flex items-center justify-center bg-black overflow-hidden">
                    {gettingActivity ? (
                        <LoadingPage />
                    ) : activity?.mediaUrls && activity?.mediaUrls.length > 0 ? (
                        <CarouselMediaWithActionButtons
                            media={activity.mediaUrls}
                            posterName={activity.owner?.name ?? 'Unknown User'}
                            posterAvatar={activity.owner?.profileImageUrl ?? ''}
                            postDate={activity.createdAt.toString()}
                            caption={activity.caption ?? ''}
                            likesNumber={activity.likes.length}
                            commentsNumber={activity.comments}
                            onLike={() => activity && handleLike(activity.id)}
                            onComment={handleComment}
                            isLiked={!!user && (activity?.likes.includes(user.id) ?? false)}
                            playVideo={playVideo}
                        />
                    ) : (
                        <p>No media available</p>
                    )}
                </div>
            </AlertDialogContent>
            <CommentSheet open={isCommentSheetOpen} onOpenChange={setIsCommentSheetOpen} activityId={activity?.id ?? ''} />
        </AlertDialog>
    )
}
