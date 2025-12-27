import { Zap, Layout, Activity, Database } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {


    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background font-sans overflow-hidden">
            {/* Content Side */}
            <div className="flex items-center justify-center p-8 relative z-10">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                    {children}
                </div>
            </div>

            {/* Benefits / Visual Side */}
            <div className="hidden lg:flex relative overflow-hidden bg-surface items-center justify-center p-12">
                {/* Animated Background - AI Data Wave Simulation */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 -left-1/4 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-0 -right-1/4 w-full h-full bg-gradient-to-tl from-secondary/20 via-transparent to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 max-w-lg space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-display font-bold leading-tight">
                            Build Models.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                                Deploy Fast.
                            </span><br />
                            Monitor Seamlessly.
                        </h1>
                        <p className="text-xl text-slate-400 font-light">
                            The only AutoML platform you'll ever need. From raw data to production API in minutes.
                        </p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <BenefitCard
                            icon={<Zap className="w-6 h-6 text-yellow-400" />}
                            title="Automated Training"
                            desc="AutoGluon & Auto-Keras Integration"
                        />
                        <BenefitCard
                            icon={<Layout className="w-6 h-6 text-primary" />}
                            title="Auto-Deploy"
                            desc="One-click K8s serving & scaling"
                        />
                        <BenefitCard
                            icon={<Activity className="w-6 h-6 text-secondary" />}
                            title="ML Monitoring"
                            desc="Real-time drift detection & alerts"
                        />
                        <BenefitCard
                            icon={<Database className="w-6 h-6 text-accent" />}
                            title="Data Insights"
                            desc="Comprehensive bias & health checks"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:-translate-y-1 hover:shadow-glow">
            <div className="mb-4 p-3 rounded-lg bg-white/5 w-fit group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
        </div>
    );
}
