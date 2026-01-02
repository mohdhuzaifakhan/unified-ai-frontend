import { Outlet } from 'react-router-dom';
import AgentsSidebar from '../components/AgentsSidebar';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-dark-950 text-slate-200 flex">
            <AgentsSidebar />
            <main className="flex-1 ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
