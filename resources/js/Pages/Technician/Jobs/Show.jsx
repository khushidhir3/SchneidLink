import AppLayout from '@/Layouts/AppLayout';
import MapView from '@/Components/MapView';
import StatusBadge from '@/Components/StatusBadge';
import PriorityBadge from '@/Components/PriorityBadge';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ dispatch }) {
    const req = dispatch.service_request;
    const [notes, setNotes] = useState('');

    const statusActions = {
        accepted: { label: "🚗 I'm En Route", status: 'en_route', color: 'bg-indigo-500 hover:bg-indigo-600' },
        en_route: { label: "📍 I've Arrived", status: 'arrived', color: 'bg-purple-500 hover:bg-purple-600' },
        arrived:  { label: '✅ Mark Complete', status: 'completed', color: 'bg-schneider-300 hover:bg-schneider-400' },
    };

    const nextAction = statusActions[dispatch.status];
    const markers = [{ lat: req.location_lat, lng: req.location_lng, color: 'red', popup: `<b>${req.title}</b><br/>${req.location_address}` }];

    const handleStatusUpdate = () => {
        router.put(`/technician/jobs/${dispatch.id}/status`, { status: nextAction.status, notes });
    };

    return (
        <AppLayout title="Job Details">
            <Head title="Job Details" />
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                    <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-dark-800">{req.title}</h2>
                                <p className="mt-1 text-sm text-gray-500">Client: {req.client?.name || 'Unknown'}</p>
                            </div>
                            <StatusBadge status={dispatch.status} size="md" />
                        </div>
                        <p className="mt-4 text-sm text-gray-600">{req.description}</p>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div><span className="text-gray-500">Category:</span> <span className="capitalize font-medium">{req.category}</span></div>
                            <div><span className="text-gray-500">Priority:</span> <PriorityBadge priority={req.priority} /></div>
                            <div className="col-span-2"><span className="text-gray-500">Address:</span> <span className="font-medium">{req.location_address}</span></div>
                        </div>
                    </div>

                    {nextAction && (
                        <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                            {nextAction.status === 'completed' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                                        className="w-full rounded-xl border-gray-200 text-sm focus:border-schneider-300 focus:ring-schneider-300"
                                        placeholder="Add completion notes..." />
                                </div>
                            )}
                            <button onClick={handleStatusUpdate}
                                className={`w-full rounded-xl ${nextAction.color} py-3 text-sm font-bold text-white shadow-lg transition-all`}>
                                {nextAction.label}
                            </button>
                        </div>
                    )}

                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${req.location_lat},${req.location_lng}`}
                        target="_blank" rel="noopener"
                        className="block w-full rounded-xl bg-blue-500 py-3 text-center text-sm font-bold text-white shadow-lg hover:bg-blue-600 transition-colors">
                        🧭 Open in Google Maps
                    </a>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-lg border border-gray-100">
                    <h4 className="text-sm font-semibold text-dark-800 mb-3">Job Location</h4>
                    <MapView markers={markers} height="450px" center={[req.location_lat, req.location_lng]} zoom={15} />
                </div>
            </div>
        </AppLayout>
    );
}
