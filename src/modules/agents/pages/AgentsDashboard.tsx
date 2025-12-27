import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction } from "lucide-react"

export default function AgentsDashboard() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="p-4 bg-muted rounded-full">
                <Construction className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Agent Service</h2>
            <p className="text-muted-foreground max-w-md">
                This service is currently under development. Use the Admin Dashboard to manage service visibility.
            </p>
            <div className="grid gap-4 md:grid-cols-2 mt-8 w-full max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Agent Orchestration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Manage autonomous agents and their workflows.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Knowledge Base</CardTitle>
                    </CardHeader>
                    <CardContent>
                        Connect agents to RAG data sources.
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
