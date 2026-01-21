export default function Logo() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                T
            </div>
            <h1 className="text-lg font-semibold hidden md:block tracking-tight">
                Task Collaboration Manager
            </h1>
        </div>
    )
}
