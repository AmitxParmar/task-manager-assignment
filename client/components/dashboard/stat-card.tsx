import type { LucideIcon } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    trend?: "up" | "down" | "neutral"
    trendValue?: string
    className?: string
}

export function StatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    trendValue,
    className
}: StatCardProps) {
    return (
        <div className={`p-2 mx-auto capitalize border-l-8 border-l-gray-400 border bg-card/60 border-black/10 transition-all rounded-3xl w-full h-full min-h-[140px] hover:border hover:border-r-8 hover:shadow-lg flex flex-col justify-between group ${className}`}>
            <div className="bg-cyan-200/20 border-2 border-black/5 h-full rounded-2xl p-4 w-full flex flex-col justify-between relative">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
                    <div className="p-2 bg-background/50 rounded-full border border-black/5 shadow-sm">
                        <Icon className="h-4 w-4 text-foreground/80" />
                    </div>
                </div>
                <div className="flex flex-col gap-1 z-10">
                    <div className="text-3xl font-black tracking-tight">{value}</div>
                    {(description || trendValue) && (
                        <div className="flex items-center text-xs font-bold text-muted-foreground/80">
                            {trendValue && (
                                <span className={`mr-2 ${trend === 'up' ? 'text-green-600' :
                                    trend === 'down' ? 'text-red-600' : ''
                                    }`}>
                                    {trendValue}
                                </span>
                            )}
                            {description}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
