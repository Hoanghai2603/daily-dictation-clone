import { LoginForm } from "@/components/auth/LoginForm"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Sign in | DailyDictation",
    description: "Sign in to your account",
}

export default function LoginPage(): React.ReactNode {
    return (
        <Card className="border-border/40 shadow-xl backdrop-blur-sm bg-background/95 supports-[backdrop-filter]:bg-background/60">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-bold tracking-tight">Get Started</CardTitle>
                <CardDescription className="text-foreground/80">
                    Sign in with Google to continue
                </CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
            <CardFooter className="flex flex-col gap-4 text-center text-sm text-foreground/70">
                <div className="text-xs">
                    By continuing, you agree to our{" "}
                    <Link href="/terms" className="underline hover:text-primary">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline hover:text-primary">
                        Privacy Policy
                    </Link>
                    .
                </div>
            </CardFooter>
        </Card>
    )
}
