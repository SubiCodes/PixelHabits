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
import { Habit, useHabitStore } from "@/store/useHabitStore"
import { useUser } from "@stackframe/stack"
import { toast } from "sonner"

const formSchema = z.object({
    title: z.string()
        .min(1, "Habit name is required")
        .min(3, "Habit name must be at least 3 characters")
        .max(50, "Habit name must be less than 50 characters"),
    description: z.string().max(200, "Description must be less than 200 characters"),
    isPublic: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface FormCreateHabitProps {
    onSuccess?: () => void
    habit: Habit
    atHabitPage?: boolean
}

export function FormEditHabit({ onSuccess, habit, atHabitPage = false }: FormCreateHabitProps) {

    const habitStore = useHabitStore();
    const user = useUser();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: habit.title,
            description: habit.description,
            isPublic: habit.isPublic,
        },
    })

    const onSubmit = (data: FormValues) => {
        if (!user?.id) {
            toast.error("User not authenticated");
            return;
        }

        habitStore.editHabit(data, habit.id, atHabitPage);

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
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Habit Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Morning Exercise"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="e.g., 30 minutes of cardio to start the day energized"
                                        rows={3}
                                        className="resize-none"
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
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </form>
        </Form>
    )
}
