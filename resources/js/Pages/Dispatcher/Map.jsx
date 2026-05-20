import AppLayout from '@/Layouts/AppLayout';
import MapView from '@/Components/MapView';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Map({ technicians, pendingRequests }) {
    const [selected, setSelected] = useState(null);

    const markers = [
        ...technicians.map(t => ({
            id: `tech-${t.id}`, lat: t.lat, lng: t.lng,
            color: t.status === 'available' ? 'green' : 'orange',
            popup: `<b>${t.name}</b><br/>⭐ ${t.rating?.toFixed(1) || 'N/A'}<br/>Status: ${t.status}`,
            type: 'technician', data: t,
        })),
        ...pendingRequests.map(r => ({
            id: `req-${r.id}`, lat: r.lat, lng: r.lng,
            color: r.priority === 'urgent' ? 'red' : 'blue',
            popup: `<b>${r.title}</b><br/>${r.category}<br/>Priority: ${r.priority}`,
            type: 'request', data: r,
        })),
    ];

    return (
        <AppLayout title="Live Map">
            <Head title="Live Map" />

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Map */}
                <div className="lg:col-span-3 rounded-2xl bg-white p-4 shadow-lg border border-gray-100">
                    <div className="mb-3 flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-green-500" /> Available</span>
                        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-orange-500" /> On Job</span>
                        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-red-500" /> Urgent Request</span>
                        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-blue-500" /> Request</span>
                    </div>
                    <MapView markers={markers} height="calc(100vh - 200px)" onMarkerClick={m => setSelected(m)} />
                </div>

                {/* Panel */}
                <div className="space-y-4">
                    <div className="rounded-2xl bg-white p-5 shadow-lg border border-gray-100">
                        <h4 className="text-sm font-semibold text-dark-800 mb-3">Legend</h4>
                        <div className="space-y-2 text-sm">
                            <p className="text-gray-600">🟢 {technicians.filter(t => t.status === 'available').length} Available</p>
                            <p className="text-gray-600">🟠 {technicians.filter(t => t.status !== 'available').length} On Job</p>
                            <p className="text-gray-600">🔴 {pendingRequests.filter(r => r.priority === 'urgent').length} Urgent Requests</p>
                            <p className="text-gray-600">🔵 {pendingRequests.length} Pending Requests</p>
                        </div>
                    </div>

                    {selected && (
                        <div className="rounded-2xl bg-white p-5 shadow-lg border border-schneider-200">
                            <h4 className="text-sm font-semibold text-dark-800">Selected</h4>
                            <p className="mt-2 text-sm font-medium">{selected.data?.name || selected.data?.title}</p>
                            {selected.type === 'technician' && (
                                <p className="text-xs text-gray-500">⭐ {selected.data.rating?.toFixed(1)} · {selected.data.status}</p>
                            )}
                            {selected.type === 'request' && (
                                <p className="text-xs text-gray-500 capitalize">{selected.data.category} · {selected.data.priority}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
