"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export function PasswordPromptModal(): React.ReactNode {
    const [isOpen, setIsOpen] = useState(false)
    const [password, setPassword] = useState("123456") // Default per requirement (in placeholder mostly)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkPasswordStatus = async () => {
            // Check if we already prompted or if user has password
            const hasPrompted = localStorage.getItem("dd_password_prompted")
            if (hasPrompted) return

            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) return

            // Logic: If user has 'google' identity but NO 'email' identity (implicitly), 
            // or if we just want to prompt everyone who might need it.
            // Supabase identities array:
            const identities = user.identities || []
            const hasEmailProvider = identities.some(id => id.provider === "email")
            const hasGoogleProvider = identities.some(id => id.provider === "google")

            if (hasGoogleProvider && !hasEmailProvider) {
                setIsOpen(true)
            }
        }

        checkPasswordStatus()
    }, [])

    const handleUpdatePassword = async () => {
        setLoading(true)
        const supabase = createClient()

        const { error } = await supabase.auth.updateUser({
            password: password
        })

        if (error) {
            alert("Error setting password: " + error.message)
        } else {
            // Success
            localStorage.setItem("dd_password_prompted", "true")
            setIsOpen(false)
            alert("Password set successfully")
        }
        setLoading(false)
    }

    const handleSkip = () => {
        localStorage.setItem("dd_password_prompted", "true")
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Set a Password</DialogTitle>
                    <DialogDescription>
                        You signed in with Google. Would you like to set a password for easier access?
                        The default suggestion is 123456.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Password
                        </Label>
                        <Input
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleSkip}>Skip</Button>
                    <Button onClick={handleUpdatePassword} disabled={loading}>Save Password</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
