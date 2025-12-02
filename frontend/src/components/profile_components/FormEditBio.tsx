"use client"
import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import {
    z
} from "zod"
import {
    toast
} from "sonner"
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError
} from "@/components/ui/field"
import {
    Button
} from "@/components/ui/button"
import {
    Textarea
} from "@/components/ui/textarea"
import { Form } from "../ui/form"
import { useProfileStore } from "@/store/useProfileStore"

const formSchema = z.object({
    bio: z.string().max(300, "Bio must be 300 characters or less")
});

interface FormEditBioProps {
    bio: string | null;
    onEditProfileSuccess: () => void;
    userId: string;
}

export default function MyForm({ bio, onEditProfileSuccess, userId }: FormEditBioProps) {

    const updatingUserProfile = useProfileStore((state) => state.updatingUserProfile);
    const updateUserProfile = useProfileStore((state) => state.updateUserProfile);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await updateUserProfile(userId, { bio: values.bio });
        onEditProfileSuccess();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Field>
                    <FieldLabel htmlFor="bio">Bio</FieldLabel>
                    <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        defaultValue={bio || ''}
                        maxLength={300}
                        {...form.register("bio")}
                    />
                    <FieldDescription>
                        Let users know more about you. ({form.watch("bio")?.length || 0}/300)
                    </FieldDescription>
                    <FieldError>{form.formState.errors.bio?.message}</FieldError>
                </Field>
                <div className="w-full flex justify-end">
                    <Button type="submit" className="cursor-pointer" disabled={updatingUserProfile}>Save</Button>
                </div>
            </form>
        </Form>
    )
}