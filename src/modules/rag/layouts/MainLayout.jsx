import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { navGroups } from '@/static/app-content/rag-nav-groups';
import { colors } from '@/static/app-content/colors';
import ShadowContainer from '@/components/ui/shadow-container';

const MainLayout = () => {
    return (
        <div className={`min-h-screen ${colors.backgroundColor} text-slate-200 flex`}>
            <ShadowContainer/>
            <Sidebar navGroups={navGroups}/>
            <main className="flex-1 ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
