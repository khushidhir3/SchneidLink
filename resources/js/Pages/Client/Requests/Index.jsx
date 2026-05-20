import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/StatusBadge';
import PriorityBadge from '@/Components/PriorityBadge';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ requests, filters }) {
    const handleFilter = (key, value) => {
        router.get('/requests', { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout title="My Requests">
            <Head title="My Requests" />

            {/* Filters */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
                <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilter('status', e.target.value)}
                    className="rounded-xl border-gray-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-schneider-300 focus:ring-schneider-300"
                >
                    <option value="">All Statuses</option>
                    {['pending', 'assigned', 'in_progress', 'completed', 'cancelled'].map(s => (
                        <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                    ))}
                </select>
                <select
                    value={filters.priority || ''}
                    onChange={(e) => handleFilter('priority', e.target.value)}
                    className="rounded-xl border-gray-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-schneider-300 focus:ring-schneider-300"
                >
                    <option value="">All Priorities</option>
                    {['low', 'medium', 'high', 'urgent'].map(p => (
                        <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                </select>
                <Link href="/requests/create" className="ml-auto inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-schneider-300 to-schneider-500 px-5 py-2 text-sm font-semibold text-white shadow-lg">
                    + New Request
                </Link>
            </div>

            {/* List */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b bg-gray-50/50">
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Title</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Category</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Priority</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Status</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Created</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {requests.data?.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No requests found.</td></tr>
                        ) : (
                            requests.data?.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-dark-800">{req.title}</td>
                                    <td className="px-6 py-4 text-sm capitalize text-gray-600">{req.category}</td>
                                    <td className="px-6 py-4"><PriorityBadge priority={req.priority} /></td>
                                    <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(req.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <Link href={`/requests/${req.id}/track`} className="text-sm text-schneider-300 hover:text-schneider-500 font-medium">Track</Link>
                                        {req.status === 'pending' && (
                                            <Link href={`/requests/${req.id}/cancel`} method="put" as="button" className="text-sm text-red-400 hover:text-red-600 font-medium">Cancel</Link>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
