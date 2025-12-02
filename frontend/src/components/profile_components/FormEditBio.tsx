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

const formSchema = z.object({
    name_7014623539: z.string()
});

export default function MyForm() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            toast(
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(values, null, 2)}</code>
                </pre>
            );
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
                <Field>
                    <FieldLabel htmlFor="name_7014623539">Bio</FieldLabel>
                    <Textarea
                        id="name_7014623539"
                        placeholder="Placeholder"

                        {...form.register("name_7014623539")}
                    />
                    <FieldDescription>You can @mention other users and organizations.</FieldDescription>
                    <FieldError>{form.formState.errors.name_7014623539?.message}</FieldError>
                </Field>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}