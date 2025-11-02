import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ReactNode } from "react"
import { X } from "lucide-react"
import { Activity } from "@/store/useHabitStore"
import CarouselMediaWithActionButtons from "./CarouselMediaWithActionButtons"

interface DialogCreateHabitProps {
    trigger?: ReactNode
    open: boolean
    close: () => void
    activity: Activity | null
}

export function DialogViewActivity({trigger, open, close, activity}: DialogCreateHabitProps) {

    // Predefined data for now
    const posterName = "John Doe";
    const posterAvatar = "https://github.com/shadcn.png";
    const postDate = new Date(activity?.createdAt || new Date()).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
    const caption = activity?.caption || "This is a sample caption for the activity post. Keep up the great work!";

    const handleLike = () => {
        console.log("Like clicked");
        // TODO: Implement like functionality
    };

    const handleComment = () => {
        console.log("Comment clicked");
        // TODO: Implement comment functionality
    };

    return (
        <AlertDialog open={open} onOpenChange={close}>
            <AlertDialogContent className="pb-2 px-2 pt-0 max-w-md h-auto">
                <AlertDialogHeader className="border-b border-black grid grid-cols-3 w-full items-center py-2">
                    <div/>
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
                    {activity?.mediaUrls && activity?.mediaUrls.length > 0 ? (
                        <CarouselMediaWithActionButtons 
                            media={activity.mediaUrls}
                            posterName={posterName}
                            posterAvatar={posterAvatar}
                            postDate={postDate}
                            caption={caption}
                            onLike={handleLike}
                            onComment={handleComment}
                        />
                    ) : (
                        <p>No media available</p>
                    )}
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
