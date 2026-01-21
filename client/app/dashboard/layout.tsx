import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <DashboardHeader />
            <div className="flex flex-1 relative">
                <DashboardSidebar className="shrink-0 z-50" />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth lg:pl-72 pb-24 lg:pb-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
