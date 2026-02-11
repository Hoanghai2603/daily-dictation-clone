import { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/LoginForm"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Login | DailyDictation",
    description: "Login to your account",
}

export default function LoginPage(): React.ReactNode {
    return (
        <Card className="border-border/40 shadow-xl backdrop-blur-sm bg-background/95 supports-[backdrop-filter]:bg-background/60">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                <CardDescription>
                    Enter your email to sign in to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
            <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground">
                <div>
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-medium text-primary hover:underline">
                        Sign up
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
