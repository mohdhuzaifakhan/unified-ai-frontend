import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
    return (
        <header className="h-16 border-b bg-background flex items-center justify-between px-6">
            <div className="flex items-center gap-4 w-96">
                <div className="relative w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        placeholder="Search services..."
                        className="w-full h-9 pl-8 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>
            </div>
        </header>
    )
}
