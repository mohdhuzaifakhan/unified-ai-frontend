import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Ensure this is installed
import { ArrowRight, Check, CheckCircle2, Building, Key, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Link } from "react-router-dom";
import { cn } from "../components/ui/button";

const STEPS = [
    { id: 1, name: "Account", icon: User },
    { id: 2, name: "Workspace", icon: Building },
    { id: 3, name: "API Key", icon: Key },
];

export default function Signup() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        company: "",
        tier: "starter"
    });

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Submit
            setLoading(true);
            setTimeout(() => setLoading(false), 2000); // Simulate API
        }
    };

    const handleBack = () => setStep(step - 1);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white">Create your account</h2>
                <p className="text-slate-400">Start building models in minutes.</p>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-between items-center relative px-2">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface rounded-full -z-10">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-in-out"
                        style={{ width: `${((step - 1) / 2) * 100}%` }}
                    />
                </div>
                {STEPS.map((s) => (
                    <div key={s.id} className="flex flex-col items-center gap-2 bg-background p-2 rounded-full">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                            step >= s.id ? "bg-primary border-primary text-white shadow-glow" : "bg-surface border-slate-700 text-slate-500"
                        )}>
                            {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                        </div>
                        <span className={cn("text-xs font-medium transition-colors", step >= s.id ? "text-primary" : "text-slate-500")}>
                            {s.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Form Card */}
            <Card className="border-0 shadow-2xl bg-glass-surface/50 backdrop-blur-xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <CardContent className="pt-6 space-y-4 min-h-[320px]">
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Full Name</label>
                                        <Input
                                            placeholder="John Doe"
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Email Address</label>
                                        <Input
                                            type="email"
                                            placeholder="john@company.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Password</label>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Company Name (Optional)</label>
                                        <Input
                                            placeholder="Acme Inc."
                                            value={formData.company}
                                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-slate-300">Select Tier</label>
                                        <div className="grid gap-4">
                                            {['starter', 'pro', 'enterprise'].map((tier) => (
                                                <div
                                                    key={tier}
                                                    onClick={() => setFormData({ ...formData, tier })}
                                                    className={cn(
                                                        "p-4 rounded-xl border cursor-pointer transition-all hover:bg-white/5 flex items-center justify-between",
                                                        formData.tier === tier ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "border-white/10"
                                                    )}
                                                >
                                                    <div>
                                                        <div className="font-semibold text-white capitalize">{tier}</div>
                                                        <div className="text-xs text-slate-400">
                                                            {tier === 'starter' && 'For individuals. $0/mo'}
                                                            {tier === 'pro' && 'For teams. $49/mo'}
                                                            {tier === 'enterprise' && 'Custom setup. Contact us'}
                                                        </div>
                                                    </div>
                                                    {formData.tier === tier && <CheckCircle2 className="w-5 h-5 text-primary" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="text-center space-y-6 py-4">
                                    <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto animate-pulse-glow">
                                        <CheckCircle2 className="w-10 h-10 text-success" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold text-white">All Set!</h3>
                                        <p className="text-slate-400">
                                            Your workspace <span className="text-white font-medium">{formData.company || "Personal"}</span> is ready.
                                            Click below to generate your API key.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </motion.div>
                </AnimatePresence>

                <CardFooter className="flex justify-between border-t border-white/5 pt-6">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={step === 1 || loading}
                        className={step === 1 ? "invisible" : ""}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        className="w-32 group"
                        isLoading={loading}
                        variant={step === 3 ? "default" : "secondary"}
                    >
                        {step === 3 ? "Create Account" : "Next Step"}
                        {step !== 3 && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                    </Button>
                </CardFooter>
            </Card>

            <p className="text-center text-sm text-slate-500">
                Already have an account? <Link to="/login" className="text-primary hover:underline hover:text-primary/80 transition-colors">Sign in</Link>
            </p>
        </div>
    );
}
