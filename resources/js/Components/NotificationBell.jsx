import { useState, useEffect } from 'react';
import axios from 'axios';

export default function NotificationBell({ userId }) {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.is_read).length;

    useEffect(() => {
        axios.get('/notifications').then(res => setNotifications(res.data)).catch(() => {});

        if (window.Echo && userId) {
            const channel = window.Echo.private(`user.${userId}`);
            channel.listen('.notification.new', (data) => {
                setNotifications(prev => [{ ...data, is_read: false, created_at: new Date().toISOString() }, ...prev]);
            });

            return () => channel.stopListening('.notification.new');
        }
    }, [userId]);

    const markAsRead = (id) => {
        axios.put(`/notifications/${id}/read`).then(() => {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        });
    };

    const markAllRead = () => {
        axios.put('/notifications/read-all').then(() => {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                id="notification-bell"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h3 className="font-semibold text-dark-800">Notifications</h3>
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-xs text-schneider-300 hover:text-schneider-500 font-medium">
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <p className="p-4 text-center text-sm text-gray-400">No notifications</p>
                            ) : (
                                notifications.slice(0, 15).map((n) => (
                                    <div
                                        key={n.id}
                                        onClick={() => !n.is_read && markAsRead(n.id)}
                                        className={`cursor-pointer border-b border-gray-50 px-4 py-3 transition-colors hover:bg-gray-50 ${!n.is_read ? 'bg-schneider-50/30' : ''}`}
                                    >
                                        <div className="flex items-start gap-2">
                                            {!n.is_read && <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-schneider-300" />}
                                            <div className="min-w-0">
                                                <p className="text-sm text-dark-800 truncate">{n.message}</p>
                                                <p className="mt-0.5 text-xs text-gray-400">
                                                    {new Date(n.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
