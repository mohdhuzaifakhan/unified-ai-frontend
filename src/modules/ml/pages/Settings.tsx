import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";

export default function Settings() {
    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-slate-400">Manage your workspace preferences.</p>
            </div>

            {/* Profile */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Full Name</label>
                            <Input defaultValue="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email</label>
                            <Input defaultValue="john@company.com" disabled />
                        </div>
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>

            {/* API Key */}
            <Card>
                <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Manage credentials for accessing the SDK</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input value="sk_live_51Mz...Xy92" readOnly className="font-mono bg-black/40" />
                        <Button variant="outline">Revoke</Button>
                    </div>
                    <Button variant="secondary">Generate New Key</Button>
                </CardContent>
            </Card>

            {/* Billing */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle>Plan: Pro</CardTitle>
                    <CardDescription>You are on the $49/mo plan</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">Next billing date: Dec 24, 2025</div>
                        <Button variant="outline">Manage Subscription</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
