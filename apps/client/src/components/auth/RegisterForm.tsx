"use client"

import * as React from "react"
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton"

export function RegisterForm() {
    return (
        <div className="grid gap-6">

            <GoogleAuthButton text="Sign up with Google" />
        </div>
    )
}
