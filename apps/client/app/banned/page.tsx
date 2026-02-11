import { Metadata } from "next"
import { Ban } from "lucide-react"

export const metadata: Metadata = {
    title: "Account Banned",
    description: "Your account has been suspended.",
}

const BannedPage: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 rounded-full bg-red-100 p-4 text-red-600 dark:bg-red-900/30">
                <Ban className="h-12 w-12" />
            </div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight">Account Suspended</h1>
            <p className="mb-8 max-w-[500px] text-muted-foreground">
                Your account has been suspended due to violations of our terms of service.
                If you believe this is a mistake, please contact support.
            </p>
            {/* 
        Ideally, we sign them out so they can try a different account, 
        or just leave them stranded. A logout button is helpful.
      */}
            <form action="/auth/signout" method="post">
                <button className="text-sm font-medium text-primary hover:underline">
                    Sign out
                </button>
            </form>
        </div>
    )
}

export default BannedPage
