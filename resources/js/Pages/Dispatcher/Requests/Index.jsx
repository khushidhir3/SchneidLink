import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/StatusBadge';
import PriorityBadge from '@/Components/PriorityBadge';
import { Head, Link } from '@inertiajs/react';

export default function Index({ requests }) {
    return (
        <AppLayout title="All Service Requests">
            <Head title="Service Requests" />
            <div className="rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b bg-gray-50/50">
                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase">Title & Client</th>
                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase">Priority</th>
                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 font-semibold text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {requests.data?.map(req => (
                            <tr key={req.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-dark-800">{req.title}</div>
                                    <div className="text-xs text-gray-500">{req.client?.name}</div>
                                </td>
                                <td className="px-6 py-4 capitalize text-gray-600">{req.category}</td>
                                <td className="px-6 py-4"><PriorityBadge priority={req.priority} /></td>
                                <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                                <td className="px-6 py-4 text-gray-500">{new Date(req.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <Link href={`/dispatcher/requests/${req.id}`} className="text-schneider-500 font-medium hover:underline">
                                        View →
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {requests.data?.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No requests found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
