import { useState } from 'react';
import { Save, User, Bell, Palette, Globe, Shield } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'general', label: 'General', icon: Globe },
    ];

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
                    <p className="text-slate-400">Manage your account and application preferences.</p>
                </div>
                <button className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                        ${activeTab === tab.id
                                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }
                    `}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl p-8">
                    {activeTab === 'profile' && (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">First Name</label>
                                    <input type="text" defaultValue="John" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-brand-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Last Name</label>
                                    <input type="text" defaultValue="Doe" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-brand-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                                    <input type="email" defaultValue="john@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-brand-500" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="text-lg font-semibold text-white mb-4">Theme Preferences</h3>
                            <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                                <div>
                                    <h4 className="text-white font-medium">Dark Mode</h4>
                                    <p className="text-xs text-slate-500">Use system preference</p>
                                </div>
                                <div className="w-10 h-6 bg-brand-600 rounded-full cursor-pointer relative">
                                    <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {(activeTab === 'notifications' || activeTab === 'general') && (
                        <div className="text-center py-12 text-slate-500">
                            <p>Settings for {activeTab} available soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
