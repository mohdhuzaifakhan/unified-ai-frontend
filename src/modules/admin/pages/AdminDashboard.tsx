import { Link } from "react-router-dom"
import { useServices } from "@/modules/admin/context/ServiceContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft } from "lucide-react"

export default function AdminDashboard() {
    const { services, toggleService } = useServices();

    return (
        <div className="min-h-screen bg-background">
            {/* Admin Header */}
            <div className="border-b border-slate-800 bg-surface/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-2xl font-display font-bold text-gradient">
                            Admin Dashboard
                        </h1>
                    </div>
                    <div className="text-sm text-slate-400">
                        Platform Administration
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="space-y-8">
                    {/* Service Management */}
                    <Card className="glass border-glass-border">
                        <CardHeader>
                            <CardTitle className="text-2xl">Service Management</CardTitle>
                            <p className="text-slate-400 text-sm">
                                Enable or disable AI services for the platform
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="flex items-center justify-between p-4 rounded-lg bg-surface/50 border border-slate-800"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                                                <service.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-white">{service.name}</h4>
                                                <p className="text-sm text-slate-400">{service.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-slate-300">
                                                {service.enabled ? 'Enabled' : 'Disabled'}
                                            </span>
                                            <Switch
                                                checked={service.enabled}
                                                onCheckedChange={() => toggleService(service.id)}
                                                disabled={service.id === 'admin' || service.id === 'dashboard'}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Platform Metrics */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="glass border-glass-border">
                            <CardHeader>
                                <CardTitle className="text-lg">Total Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-gradient">1,234</div>
                                <p className="text-sm text-slate-400 mt-2">+12% this month</p>
                            </CardContent>
                        </Card>

                        <Card className="glass border-glass-border">
                            <CardHeader>
                                <CardTitle className="text-lg">API Requests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-gradient">45.2K</div>
                                <p className="text-sm text-slate-400 mt-2">+8% this week</p>
                            </CardContent>
                        </Card>

                        <Card className="glass border-glass-border">
                            <CardHeader>
                                <CardTitle className="text-lg">System Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-success">99.9%</div>
                                <p className="text-sm text-slate-400 mt-2">Uptime</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
