import { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Register | DailyDictation",
    description: "Create an account",
}

export default function RegisterPage(): React.ReactNode {
    return (
        <Card className="border-border/40 shadow-xl backdrop-blur-sm bg-background/95 supports-[backdrop-filter]:bg-background/60">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
                <CardDescription>
                    Enter your email below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RegisterForm />
            </CardContent>
            <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground">
                <div>
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-primary hover:underline">
                        Sign in
                    </Link>
                </div>
                <div className="text-xs">
                    By clicking continue, you agree to our{" "}
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
