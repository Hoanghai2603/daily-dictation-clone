"use client"

import { createClient } from "@/lib/supabase/client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export function BannedCheck() {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const checkStatus = async () => {
            if (pathname === '/banned') return

            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()

            if (session) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_banned')
                    .eq('id', session.user.id)
                    .single()

                if (profile?.is_banned) {
                    router.replace('/banned')
                }
            }
        }

        checkStatus()
    }, [pathname, router])

    return null
}
