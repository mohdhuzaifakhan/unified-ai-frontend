import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock, Github } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../components/ui/card";

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            navigate("/dashboard");
        }, 1500);
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
                <p className="text-slate-400">Enter your credentials to access your workspace.</p>
            </div>

            <Card className="border-0 shadow-2xl bg-glass-surface/50 backdrop-blur-xl">
                <form onSubmit={handleLogin}>
                    <CardHeader>
                        <CardTitle className="sr-only">Login</CardTitle>
                        <CardDescription className="sr-only">Enter email and password</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <Input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="pl-10"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-slate-300">Password</label>
                                <Link to="#" className="text-xs text-primary hover:text-primary/80">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Sign In <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>

                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#131b2e] px-2 text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        <Button type="button" variant="outline" className="w-full border-white/10 hover:bg-white/5">
                            <Github className="mr-2 w-4 h-4" /> Github
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <p className="text-center text-sm text-slate-500">
                Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
            </p>
        </div>
    );
}
