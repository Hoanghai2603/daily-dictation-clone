"use client"

import * as React from "react"
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton"

export function LoginForm() {
    return (
        <div className="grid gap-6">

            <GoogleAuthButton text="Sign in with Google" />
        </div>
    )
}
