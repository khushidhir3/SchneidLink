import AppLayout from '@/Layouts/AppLayout';
import StatsCard from '@/Components/StatsCard';
import StatusBadge from '@/Components/StatusBadge';
import PriorityBadge from '@/Components/PriorityBadge';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats, recentRequests }) {
    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Requests" value={stats.total} icon="📋" color="blue" />
                <StatsCard title="Pending" value={stats.pending} icon="⏳" color="orange" />
                <StatsCard title="In Progress" value={stats.in_progress} icon="🔧" color="purple" />
                <StatsCard title="Completed" value={stats.completed} icon="✅" color="schneider" />
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-dark-800">Recent Requests</h3>
                <Link
                    href="/requests/create"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-schneider-300 to-schneider-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-schneider-300/25 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                    <span>+</span> New Request
                </Link>
            </div>

            {/* Table */}
            <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Title</th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Category</th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Priority</th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentRequests.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No requests yet. Create your first one!</td></tr>
                            ) : (
                                recentRequests.map((req) => (
                                    <tr key={req.id} className="transition-colors hover:bg-gray-50/50">
                                        <td className="px-6 py-4 text-sm font-medium text-dark-800">{req.title}</td>
                                        <td className="px-6 py-4 text-sm capitalize text-gray-600">{req.category}</td>
                                        <td className="px-6 py-4"><PriorityBadge priority={req.priority} /></td>
                                        <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(req.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <Link href={`/requests/${req.id}/track`} className="text-sm font-medium text-schneider-300 hover:text-schneider-500">
                                                Track →
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
