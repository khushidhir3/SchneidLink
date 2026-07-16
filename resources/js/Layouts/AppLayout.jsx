import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import NotificationBell from '@/Components/NotificationBell';

const navItems = {
    client: [
        { label: 'Dashboard', href: '/dashboard', icon: '📊' },
        { label: 'My Requests', href: '/requests', icon: '📋' },
        { label: 'New Request', href: '/requests/create', icon: '➕' },
    ],
    technician: [
        { label: 'Dashboard', href: '/technician/dashboard', icon: '🏠' },
        { label: 'My Jobs', href: '/technician/jobs', icon: '🔧' },
    ],
    dispatcher: [
        { label: 'Dashboard', href: '/dispatcher/dashboard', icon: '📡' },
        { label: 'Requests', href: '/dispatcher/requests', icon: '📋' },
        { label: 'Technicians', href: '/dispatcher/technicians', icon: '👷' },
        { label: 'Live Map', href: '/dispatcher/map', icon: '🗺️' },
    ],
    admin: [
        { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
        { label: 'Users', href: '/admin/users', icon: '👥' },
        { label: 'Technicians', href: '/admin/technicians', icon: '👷' },
        { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
        { label: 'Dispatch', href: '/dispatcher/dashboard', icon: '📡' },
        { label: 'Live Map', href: '/dispatcher/map', icon: '🗺️' },
    ],
};

export default function AppLayout({ children, title }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const role = user?.role || 'client';
    const items = navItems[role] || navItems.client;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentPath = window.location.pathname;

    return (
        <div className="flex h-screen bg-gray-50">
            {sidebarOpen && (
                <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-dark-800 transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex h-16 items-center gap-3 border-b border-dark-700 px-6">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-schneider-300 to-schneider-500 text-white font-bold text-sm shadow-lg">
                        SF
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-white">Schneider</h1>
                        <p className="text-[10px] font-medium text-schneider-300">FieldDispatch</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <div className="space-y-1">
                        {items.map((item) => {
                            const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? 'bg-schneider-300/10 text-schneider-300 shadow-sm'
                                            : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                                    }`}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    {item.label}
                                    {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-schneider-300" />}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <div className="border-t border-dark-700 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-dark-600 text-sm font-semibold text-schneider-300">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
                            <p className="truncate text-xs text-gray-500 capitalize">{role}</p>
                        </div>
                    </div>
                    <Link
                        href="/profile"
                        className="mt-3 block w-full rounded-lg bg-dark-700 px-3 py-1.5 text-center text-xs font-medium text-gray-400 hover:bg-dark-600 hover:text-white transition-colors"
                    >
                        Edit Profile
                    </Link>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="mt-1.5 block w-full rounded-lg px-3 py-1.5 text-center text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        Log Out
                    </Link>
                </div>
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-8 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                        {title && <h2 className="text-lg font-semibold text-dark-800">{title}</h2>}
                    </div>
                    <div className="flex items-center gap-3">
                        <NotificationBell userId={user?.id} role={role} />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
