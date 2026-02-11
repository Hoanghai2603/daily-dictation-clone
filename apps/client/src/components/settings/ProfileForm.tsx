"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
import { userService } from "@/services/user.service"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Loader2, Mail, Phone, User } from "lucide-react"

const profileFormSchema = z.object({
    full_name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        })
        .max(30, {
            message: "Name must not be longer than 30 characters.",
        }),
    phone: z.string().optional(),
    avatar_url: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm(): React.ReactNode {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [avatarUrl, setAvatarUrl] = useState<string>("");

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            full_name: "",
            phone: "",
            avatar_url: "",
        },
        mode: "onChange",
    })

    useEffect(() => {
        async function loadProfile() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setEmail(user.email || "");
                setAvatarUrl(user.user_metadata?.avatar_url || "");

                try {
                    const { profile } = await userService.getUser(user.id);

                    if (profile) {
                        form.reset({
                            full_name: profile.full_name || user.user_metadata?.full_name || "",
                            phone: profile.phone || "",
                            avatar_url: profile.avatar_url || user.user_metadata?.avatar_url || "",
                        });
                        if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
                    }
                } catch (error) {
                    console.error("Failed to load profile", error);
                }
            }
        }
        loadProfile();
    }, [form]);

    async function onSubmit(data: ProfileFormValues) {
        setIsLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setIsLoading(false);
            return;
        }

        try {
            await userService.updateUser(user.id, {
                full_name: data.full_name,
                phone: data.phone,
                avatar_url: data.avatar_url || avatarUrl,
            });

            toast.success("Profile updated");
            form.reset(data); // Reset form state to make it no longer dirty
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Error updating profile");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-x-6">
                <Avatar className="h-20 w-20 border-2 border-border/50">
                    <AvatarImage src={avatarUrl} alt="Avatar" />
                    <AvatarFallback className="text-xl">{form.getValues("full_name")?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <h3 className="font-medium leading-none">{form.getValues("full_name") || "User"}</h3>
                    <p className="text-sm text-muted-foreground">{email}</p>
                    <p className="text-xs text-muted-foreground mt-1 px-2 py-0.5 rounded-full bg-muted inline-block">
                        Managed by Google
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Your name" {...field} className="pl-9" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="+1 234 567 890" {...field} className="pl-9" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid gap-4">
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input value={email} disabled className="pl-9 bg-muted/50" />
                                </div>
                            </FormControl>
                            <FormDescription>
                                Email address is managed by your login provider and cannot be changed here.
                            </FormDescription>
                        </FormItem>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading || !form.formState.isDirty} className="min-w-[120px]">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
