"use client"

import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useLogout } from "@/hooks/useAuth"

export const LogoutButton = () => {
    const router = useRouter()
    const { mutateAsync: logout, isPending } = useLogout()

    const handleLogout = async () => {
        try {
            await logout()
            router.replace("/")
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    return (
        <DropdownMenuItem
            className="text-red-500 focus:text-red-500 cursor-pointer"
            onClick={handleLogout}
            disabled={isPending}
        >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log out
        </DropdownMenuItem>
    )
}
