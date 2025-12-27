import { Shield, Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "../components/ui/card";

export default function Security() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Security Center</h1>
                <p className="text-slate-400">Monitor access control and compliance status.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-green-500/5 border-green-500/20">
                    <CardHeader>
                        <CardTitle className="text-green-500 flex items-center gap-2">
                            <Shield className="w-5 h-5" /> SOC2 Compliant
                        </CardTitle>
                        <CardDescription className="text-green-500/70">Audit Passed on Nov 24, 2024</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="hover:bg-white/5 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Users className="w-5 h-5 text-primary" /> Active Sessions
                        </CardTitle>
                        <CardDescription>12 users currently logged in</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="hover:bg-white/5 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <ListChecks className="w-5 h-5 text-accent" /> Audit Logs
                        </CardTitle>
                        <CardDescription>2,403 events in last 24h</CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <h2 className="text-xl font-semibold text-white mt-8">Recent Alerts</h2>
            <Card>
                <div className="divide-y divide-white/5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-4 flex items-start gap-4 hover:bg-white/5 transition-colors">
                            <div className="mt-1">
                                {i === 1 ? <AlertTriangle className="w-5 h-5 text-yellow-500" /> : <CheckCircle2 className="w-5 h-5 text-slate-500" />}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{i === 1 ? "New API Key generated for 'Staging'" : "User 'Alex' login successful"}</p>
                                <p className="text-xs text-slate-500">10:4{i} AM · IP 192.168.1.{i}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

function ListChecks({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
            <path d="m9 11 3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
    )
}
