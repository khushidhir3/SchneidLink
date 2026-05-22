import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/StatusBadge';
import PriorityBadge from '@/Components/PriorityBadge';
import { Head, Link } from '@inertiajs/react';

export default function Show({ serviceRequest }) {
    return (
        <AppLayout title="Request Details">
            <Head title={`Request - ${serviceRequest.title}`} />
            <div className="max-w-4xl rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-dark-800">{serviceRequest.title}</h2>
                        <p className="mt-1 text-gray-500">Requested by {serviceRequest.client?.name}</p>
                    </div>
                    <div className="flex gap-2">
                        <PriorityBadge priority={serviceRequest.priority} />
                        <StatusBadge status={serviceRequest.status} />
                    </div>
                </div>

                <div className="mt-8 grid gap-8 sm:grid-cols-2">
                    <div>
                        <h3 className="font-semibold text-gray-700 uppercase tracking-wide text-xs">Description</h3>
                        <p className="mt-2 text-gray-600 text-sm leading-relaxed">{serviceRequest.description}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                        <h3 className="font-semibold text-gray-700 uppercase tracking-wide text-xs mb-3">Job Details</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Category:</strong> <span className="capitalize">{serviceRequest.category}</span></p>
                            <p><strong>Address:</strong> {serviceRequest.location_address}</p>
                            <p><strong>Created:</strong> {new Date(serviceRequest.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {serviceRequest.dispatch && (
                    <div className="mt-8 border-t pt-8">
                        <h3 className="font-semibold text-gray-700 uppercase tracking-wide text-xs mb-4">Assigned Technician</h3>
                        <div className="flex items-center gap-4 rounded-xl border border-schneider-200 bg-schneider-50 p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-schneider-500 text-white font-bold text-lg">
                                {serviceRequest.dispatch.technician.user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-dark-800">{serviceRequest.dispatch.technician.user.name}</p>
                                <p className="text-sm text-gray-600">Emp Code: {serviceRequest.dispatch.technician.employee_code}</p>
                            </div>
                            <div className="ml-auto">
                                <StatusBadge status={serviceRequest.dispatch.status} />
                            </div>
                        </div>
                    </div>
                )}
                <div className="mt-8 flex gap-3">
                    <Link href="/dispatcher/requests" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        ← Back to Requests
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
