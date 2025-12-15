"use client"

import { Button } from "@/components/ui/button"
import CarouselMediaDisplay from "./CarouselMediaDisplay"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Activity, useActivityStore } from "@/store/useActivityStore"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, X } from "lucide-react"

const formSchema = z.object({
    caption: z.string()
        .min(1, "A caption is required")
        .min(3, "Caption must be at least 3 characters")
        .max(200, "Caption must be less than 200 characters"),
    // allow either existing URLs (string) or new File objects
    mediaUrls: z.array(z.union([z.string(), z.instanceof(File)]))
        .min(1, "At least one media file is required")
        .max(5, "You can upload up to 5 files"),
    isPublic: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface FormEditActivityProps {
    onSuccess?: () => void
    activity: Activity | null
    fromProfile?: boolean
}

// Sortable media item component
function SortableMediaItem({ id, index, media, onRemove }: { id: string; index: number; media: string | File; onRemove: (index: number) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const isFile = media instanceof File;
    const mediaUrl = isFile ? URL.createObjectURL(media) : media;
    
    // Better video detection for both Files and URLs
    const isVideo = isFile 
        ? media.type.startsWith("video") 
        : mediaUrl.includes('/upload/') && mediaUrl.includes('/video/') || 
          mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i) !== null;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative group border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center h-20"
        >
            {/* Draggable content wrapper */}
            <div
                {...attributes}
                {...listeners}
                className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
                {isVideo ? (
                    <video 
                        src={mediaUrl} 
                        className="w-full h-full object-cover pointer-events-none" 
                        preload="metadata"
                        muted
                        playsInline
                    />
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mediaUrl} alt={`Media ${index}`} className="w-full h-full object-cover pointer-events-none" />
                )}

                {/* Drag indicator - visual feedback */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                    <GripVertical className="w-5 h-5 text-white drop-shadow" />
                </div>
            </div>

            {/* Remove button - outside draggable area */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(index);
                }}
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition z-20"
            >
                <X className="w-3 h-3" />
            </button>
        </div>
    );
}

export function FormEditActivity({ onSuccess, activity, fromProfile = false }: FormEditActivityProps) {

    // activityStore / user not needed for edit defaults; backend update not implemented yet

    // Track removed media URLs (strings only; Files don't need deletion)
    const editActivity = useActivityStore((state) => state.editActivity);
    const [removedMediaUrls, setRemovedMediaUrls] = useState<string[]>([]);

    // Setup DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            caption: "",
            mediaUrls: [],
            isPublic: false,
        },
    });

    // When activity prop changes, populate form defaults
    useEffect(() => {
        if (!activity) return;
        form.reset({
            caption: activity.caption ?? "",
            // activity.mediaUrls may be string[] or (string|File)[]
            mediaUrls: (activity.mediaUrls as unknown as FormValues["mediaUrls"]) ?? [],
            isPublic: activity.isPublic ?? false,
        });
        // Reset removed media URLs when activity changes
        setRemovedMediaUrls([]);
    }, [activity, form]);

    const onRemoveMedia = (index: number) => {
        const currentMedia = form.getValues("mediaUrls");
        const removedItem = currentMedia[index];
        if (typeof removedItem === "string") {
            setRemovedMediaUrls(prev => [...prev, removedItem]);
        }
        const updatedMedia = currentMedia.filter((_, i) => i !== index);
        form.setValue("mediaUrls", updatedMedia);
    }

    // Handle drag end event for reordering
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const currentMedia = form.getValues("mediaUrls");
            const oldIndex = currentMedia.findIndex((_, i) => `media-${i}` === active.id);
            const newIndex = currentMedia.findIndex((_, i) => `media-${i}` === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const reorderedMedia = arrayMove(currentMedia, oldIndex, newIndex);
                form.setValue("mediaUrls", reorderedMedia);
            }
        }
    }

    const onSubmit = async (data: FormValues) => {
        if (!activity) return;
        
        console.log('Edit activity submit:', data);
        console.log('Removed media URLs:', removedMediaUrls);
        
        // Merge form data with existing activity to create complete Activity object
        const updatedActivity: Activity = {
            ...activity,
            caption: data.caption,
            mediaUrls: data.mediaUrls,
            isPublic: data.isPublic,
        };
        
        await editActivity(activity.id, updatedActivity, removedMediaUrls, fromProfile);
        if (onSuccess) onSuccess();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <FormField
                        control={form.control}
                        name="caption"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder="Talk about what you did for this activity"
                                        rows={4}
                                        className="resize-none pt-2 px-2"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="mediaUrls"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div>
                                        <div className="border w-full max-w-full h-2xl bg-gray-50 flex items-center justify-center">
                                            <CarouselMediaDisplay media={form.getValues("mediaUrls")} onDeleteMedia={onRemoveMedia}/>
                                        </div>
                                        <div
                                            className="border-dashed border-2 border-gray-300 rounded p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                                            onClick={() => document.getElementById('media-upload-input')?.click()}
                                            onDrop={e => {
                                                e.preventDefault();
                                                const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'));
                                                field.onChange([...field.value, ...files]);
                                            }}
                                            onDragOver={e => e.preventDefault()}
                                        >
                                            <input
                                                id="media-upload-input"
                                                type="file"
                                                accept="image/*,video/*"
                                                multiple
                                                style={{ display: 'none' }}
                                                onChange={e => {
                                                    const files = Array.from(e.target.files || []).filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'));
                                                    field.onChange([...field.value, ...files]);
                                                }}
                                            />
                                            <span className="text-sm text-muted-foreground mb-2">Click or drag & drop images/videos (max 5)</span>
                                            <Button type="button" variant="outline" size="sm">Upload Media</Button>
                                        </div>

                                        {/* Media Reordering Section */}
                                        {form.getValues("mediaUrls").length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Reorder Media (drag to change position)</p>
                                                <DndContext
                                                    sensors={sensors}
                                                    collisionDetection={closestCenter}
                                                    onDragEnd={handleDragEnd}
                                                >
                                                    <SortableContext
                                                        items={form.getValues("mediaUrls").map((_, i) => `media-${i}`)}
                                                        strategy={verticalListSortingStrategy}
                                                    >
                                                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                                                            {form.getValues("mediaUrls").map((media, index) => (
                                                                <SortableMediaItem
                                                                    key={`media-${index}`}
                                                                    id={`media-${index}`}
                                                                    index={index}
                                                                    media={media}
                                                                    onRemove={onRemoveMedia}
                                                                />
                                                            ))}
                                                        </div>
                                                    </SortableContext>
                                                </DndContext>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isPublic"
                        render={({ field }) => (
                            <FormItem className="">
                                <FormLabel>Visibility</FormLabel>
                                <FormDescription className="mb-2">
                                    Make this habit visible to others on your profile
                                </FormDescription>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={(value: string) => field.onChange(value === "true")}
                                        value={field.value ? "true" : "false"}
                                        className="flex gap-4"
                                    >
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="true" />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                Yes (Public)
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="false" />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                No (Private)
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <DialogFooter className="mt-6">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={form.formState.isSubmitting}>Save Changes</Button>
                </DialogFooter>
            </form>
        </Form>
    )
}
