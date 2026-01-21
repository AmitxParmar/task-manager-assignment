import { lazy, Suspense } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import Logo from "./common/logo"
import UserNav from "./user-nav"

const NotificationsPopover = lazy(() =>
    import("./notifications-popover").then((mod) => ({ default: mod.NotificationsPopover }))
)



export function DashboardHeader() {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-border border-b bg-background/95 px-6 backdrop-blur supports-backdrop-filter:bg-background/60">
            <Logo />
            <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <ModeToggle />
                <Suspense fallback={<div className="h-9 w-9" />}>
                    <NotificationsPopover />
                </Suspense>
                <UserNav />
            </div>
        </header>
    )
}
