"use client"

import { Button } from "@/components/ui/button"
import CarouselMediaDisplay from "./CarouselMediaDisplay"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
import { useUser } from "@stackframe/stack"
import { toast } from "sonner"
import { useActivityStore } from "@/store/useActivityStore"
import { access } from "fs"

const formSchema = z.object({
    caption: z.string()
        .min(1, "A caption is required")
        .min(3, "Caption must be at least 3 characters")
        .max(200, "Caption must be less than 200 characters"),
    mediaUrls: z.array(z.instanceof(File))
        .min(1, "At least one media file is required")
        .max(5, "You can upload up to 5 files"),
    isPublic: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface FormCreateActivityProps {
    onSuccess?: () => void
    habitId: string
}

export function FormCreateActivity({ onSuccess, habitId }: FormCreateActivityProps) {

    const activityStore = useActivityStore();
    const user = useUser();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            caption: "",
            mediaUrls: [],
            isPublic: false,
        },
    });

    const onRemoveMedia = (index: number) => {
        const currentMedia = form.getValues("mediaUrls");
        const updatedMedia = currentMedia.filter((_, i) => i !== index);
        form.setValue("mediaUrls", updatedMedia);
    }

    const onSubmit = (data: FormValues) => {
        if (!user?.id) {
            toast.error("User not authenticated");
            return;
        }
        const activityData = {
            ownerId: user.id,
            habitId,
            caption: data.caption,
            isPublic: data.isPublic,
        };
        const formData = new FormData();
        formData.append("activity", JSON.stringify(activityData));
        data.mediaUrls.forEach((file: File) => {
            formData.append("mediaUrls", file);
        });
        activityStore.addActivity(formData);

        if (onSuccess) {
            onSuccess();
        }
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
                                        <div className="border w-full aspect-video h-2xl bg-gray-50 flex items-center justify-center">
                                            <CarouselMediaDisplay media={field.value} onDeleteMedia={onRemoveMedia} />
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
                                        {field.value && field.value.length > 0 && (
                                            <ul className="mt-2 text-xs text-muted-foreground">
                                                {field.value.map((file: File, idx: number) => (
                                                    <li key={idx} className="truncate">{file.name}</li>
                                                ))}
                                            </ul>
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
                    <Button type="submit">Post Activity</Button>
                </DialogFooter>
            </form>
        </Form>
    )
}
