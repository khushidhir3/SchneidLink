import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/StatusBadge';
import { Head, Link } from '@inertiajs/react';

export default function Index({ dispatches }) {
    return (
        <AppLayout title="My Jobs">
            <Head title="My Jobs" />

            <div className="overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b bg-gray-50/50">
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Job Title</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Category</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Status</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Date</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {dispatches.data?.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No jobs yet</td></tr>
                        ) : dispatches.data?.map(d => (
                            <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-dark-800">{d.service_request?.title || 'N/A'}</td>
                                <td className="px-6 py-4 capitalize text-gray-600">{d.service_request?.category}</td>
                                <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
                                <td className="px-6 py-4 text-gray-500">{new Date(d.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <Link href={`/technician/jobs/${d.id}`} className="text-sm font-medium text-schneider-300 hover:text-schneider-500">
                                        View →
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
