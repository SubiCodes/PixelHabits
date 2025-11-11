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
import { ReactNode } from "react"
import { Ellipsis, X, Edit, Trash2 } from "lucide-react"
import { Activity } from "@/store/useActivityStore"
import CarouselMediaWithActionButtons from "../CarouselMediaWithActionButtons"

interface DialogCreateHabitProps {
    trigger?: ReactNode
    open: boolean
    close: () => void
    activity: Activity | null
    editFunc?: (activity: Activity | null) => void
    deleteFunc?: () => void
}

export function DialogViewActivity({trigger, open, close, activity, editFunc, deleteFunc}: DialogCreateHabitProps) {

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
                    <div>
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
                    {activity?.mediaUrls && activity?.mediaUrls.length > 0 ? (
                        <CarouselMediaWithActionButtons 
                            media={activity.mediaUrls}
                            posterName={activity.user?.name || "Unknown User"}
                            posterAvatar={activity.user?.profileImageUrl ?? ""}
                            postDate={activity.createdAt ? new Date(activity.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                            }) : ""}
                            caption={activity.caption ?? ""}
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
