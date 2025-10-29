"use client"

import { Button } from "@/components/ui/button"
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
import { useHabitStore } from "@/store/useHabitStore"
import { useUser } from "@stackframe/stack"
import { toast } from "sonner"

const formSchema = z.object({
    caption: z.string()
        .min(1, "A caption is required")
        .min(3, "Caption must be at least 3 characters")
        .max(200, "Caption must be less than 200 characters"),
    mediaUrls: z.array(z.instanceof(File)).max(5, "You can upload up to 5 files"),
    isPublic: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface FormCreateHabitProps {
    onSuccess?: () => void
}

export function FormCreateHabit({ onSuccess }: FormCreateHabitProps) {

    const habitStore = useHabitStore();
    const user = useUser();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            caption: "",
            mediaUrls: [],
            isPublic: false,
        },
    })

    const onSubmit = (data: FormValues) => {
        if (!user?.id) {
            toast.error("User not authenticated");
            return;
        }

        // const habitPayload = { ownerId: user.id, ...data };
        // habitStore.addHabit(habitPayload);

        if (onSuccess) {
            onSuccess()
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="caption"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Caption</FormLabel>
                                <FormControl>
                                     <Textarea
                                        placeholder="Talk about what you did for this activity"
                                        rows={3}
                                        className="resize-none border-0"
                                        {...field}
                                    />
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
                    <Button type="submit">Create Habit</Button>
                </DialogFooter>
            </form>
        </Form>
    )
}
