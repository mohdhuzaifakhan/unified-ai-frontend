import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { Bot, Layers, LayoutDashboard, Settings, User } from 'lucide-react';

export interface Service {
    id: string;
    name: string;
    path: string;
    icon: any;
    enabled: boolean;
    description: string;
}

interface ServiceContextType {
    services: Service[];
    toggleService: (id: string) => void;
}

const defaultServices: Service[] = [
    {
        id: 'dashboard',
        name: 'Overview',
        path: '/',
        icon: LayoutDashboard,
        enabled: true,
        description: 'Platform overview and metrics'
    },
    {
        id: 'ml',
        name: 'ML Service',
        path: '/services/ml',
        icon: Bot,
        enabled: true,
        description: 'AutoML and Model Management'
    },
    {
        id: 'rag',
        name: 'RAG Service',
        path: '/services/rag',
        icon: Layers,
        enabled: true,
        description: 'Retrieval Augmented Generation workflows'
    },
    {
        id: 'agents',
        name: 'Agent Service',
        path: '/services/agents',
        icon: User,
        enabled: false,
        description: 'Agentic workflows and orchestration'
    },
    {
        id: 'admin',
        name: 'Admin',
        path: '/admin',
        icon: Settings,
        enabled: true,
        description: 'Platform administration'
    },
];

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
    const [services, setServices] = useState<Service[]>(defaultServices);

    const toggleService = (id: string) => {
        setServices(prev => prev.map(s =>
            s.id === id ? { ...s, enabled: !s.enabled } : s
        ));
    };

    return (
        <ServiceContext.Provider value={{ services, toggleService }}>
            {children}
        </ServiceContext.Provider>
    );
}

export function useServices() {
    const context = useContext(ServiceContext);
    if (context === undefined) {
        throw new Error('useServices must be used within a ServiceProvider');
    }
    return context;
}
