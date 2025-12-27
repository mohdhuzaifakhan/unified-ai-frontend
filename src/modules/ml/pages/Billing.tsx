import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CreditCard, Zap, Clock, Download } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";

const USAGE_DATA = [
    { day: "Mon", compute: 12 },
    { day: "Tue", compute: 18 },
    { day: "Wed", compute: 45 }, // Spike
    { day: "Thu", compute: 24 },
    { day: "Fri", compute: 30 },
    { day: "Sat", compute: 8 },
    { day: "Sun", compute: 5 },
];

export default function Billing() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Billing & Usage</h1>
                    <p className="text-slate-400">Manage your subscription and monitor costs.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" /> Export Invoices
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-primary flex items-center gap-2">
                            <Zap className="w-5 h-5" /> Pro Plan
                        </CardTitle>
                        <CardDescription className="text-primary/70">$49 / month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white mb-2">$34.50</div>
                        <div className="text-xs text-slate-400">Current cycle usage (Dec 1 - Dec 10)</div>
                        <div className="w-full bg-black/20 h-1.5 rounded-full mt-4 overflow-hidden">
                            <div className="bg-primary h-full w-[70%]" />
                        </div>
                        <div className="text-xs text-right text-slate-400 mt-1">70% of included Limit</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Clock className="w-5 h-5 text-accent" /> Compute Hours
                        </CardTitle>
                        <CardDescription>GPU T4 Instance usage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">142 hrs</div>
                        <p className="text-xs text-slate-400 mt-1">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <CreditCard className="w-5 h-5 text-green-500" /> Payment Method
                        </CardTitle>
                        <CardDescription>Next charge: Dec 31, 2025</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                                <span className="font-bold text-slate-900 text-xs italic">VISA</span>
                            </div>
                            <span className="text-white font-mono">•••• 4242</span>
                        </div>
                        <Button variant="link" className="text-primary p-0 h-auto mt-4 text-xs">Update Data</Button>
                    </CardContent>
                </Card>
            </div>

            <Card className="pb-4">
                <CardHeader>
                    <CardTitle>Daily Compute Usage (GPU Hours)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={USAGE_DATA}>
                                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}h`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "white" }}
                                    itemStyle={{ color: "#3b82f6" }}
                                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                                />
                                <Bar dataKey="compute" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
