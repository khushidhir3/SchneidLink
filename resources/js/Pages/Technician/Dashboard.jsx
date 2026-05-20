import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/StatusBadge';
import StatsCard from '@/Components/StatsCard';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Dashboard({ technician, activeDispatch, pendingDispatches, todayCompleted }) {
    // Send location updates every 30 seconds when available or on job
    useEffect(() => {
        if (technician.availability_status === 'offline') return;
        const sendLocation = () => {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition((pos) => {
                fetch('/technician/location', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '' },
                    body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy_m: pos.coords.accuracy }),
                }).catch(() => {});
            });
        };
        sendLocation();
        const interval = setInterval(sendLocation, 30000);
        return () => clearInterval(interval);
    }, [technician.availability_status]);

    const toggleAvailability = () => {
        const newStatus = technician.availability_status === 'available' ? 'offline' : 'available';
        router.put('/technician/availability', { status: newStatus });
    };

    return (
        <AppLayout title="Technician Dashboard">
            <Head title="Technician Dashboard" />

            {/* Availability Toggle */}
            <div className="mb-6 flex items-center justify-between rounded-2xl bg-white p-5 shadow-lg border border-gray-100">
                <div>
                    <h3 className="text-sm font-semibold text-dark-800">Your Status</h3>
                    <StatusBadge status={technician.availability_status} size="md" />
                </div>
                {technician.availability_status !== 'on_job' && (
                    <button onClick={toggleAvailability}
                        className={`rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all ${
                            technician.availability_status === 'available'
                                ? 'bg-gray-500 hover:bg-gray-600'
                                : 'bg-gradient-to-r from-schneider-300 to-schneider-500 hover:shadow-xl'
                        }`}>
                        {technician.availability_status === 'available' ? 'Go Offline' : 'Go Available'}
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
                <StatsCard title="Today's Jobs" value={todayCompleted} icon="📋" color="schneider" />
                <StatsCard title="Rating" value={technician.rating_avg?.toFixed(1) || '0.0'} icon="⭐" color="orange" />
                <StatsCard title="Total Jobs" value={technician.total_jobs} icon="🔧" color="blue" />
            </div>

            {/* Active Job */}
            {activeDispatch && (
                <div className="mb-6 rounded-2xl bg-gradient-to-br from-schneider-300/5 to-schneider-500/5 p-6 shadow-lg border-2 border-schneider-300/30">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-dark-800">🔧 Active Job</h3>
                        <StatusBadge status={activeDispatch.status} size="md" />
                    </div>
                    <h4 className="text-base font-semibold text-dark-800">{activeDispatch.service_request?.title}</h4>
                    <p className="mt-1 text-sm text-gray-600">{activeDispatch.service_request?.location_address}</p>

                    <div className="mt-4 flex flex-wrap gap-3">
                        {activeDispatch.status === 'accepted' && (
                            <button onClick={() => router.put(`/technician/jobs/${activeDispatch.id}/status`, { status: 'en_route' })}
                                className="flex-1 rounded-xl bg-indigo-500 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-600 transition-colors">
                                🚗 I'm En Route
                            </button>
                        )}
                        {activeDispatch.status === 'en_route' && (
                            <button onClick={() => router.put(`/technician/jobs/${activeDispatch.id}/status`, { status: 'arrived' })}
                                className="flex-1 rounded-xl bg-purple-500 py-3 text-sm font-bold text-white shadow-lg hover:bg-purple-600 transition-colors">
                                📍 I've Arrived
                            </button>
                        )}
                        {activeDispatch.status === 'arrived' && (
                            <button onClick={() => router.put(`/technician/jobs/${activeDispatch.id}/status`, { status: 'completed' })}
                                className="flex-1 rounded-xl bg-schneider-300 py-3 text-sm font-bold text-white shadow-lg hover:bg-schneider-400 transition-colors">
                                ✅ Mark Complete
                            </button>
                        )}
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${activeDispatch.service_request?.location_lat},${activeDispatch.service_request?.location_lng}`}
                            target="_blank" rel="noopener"
                            className="rounded-xl bg-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-600 transition-colors">
                            🧭 Navigate
                        </a>
                    </div>
                </div>
            )}

            {/* Pending Job Requests */}
            {pendingDispatches.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-dark-800 mb-4">Pending Requests</h3>
                    <div className="space-y-3">
                        {pendingDispatches.map((d) => (
                            <div key={d.id} className="rounded-2xl bg-white p-5 shadow-md border border-gray-100 transition-all hover:shadow-lg">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-semibold text-dark-800">{d.service_request?.title}</h4>
                                        <p className="mt-1 text-sm text-gray-500">{d.service_request?.location_address}</p>
                                        <p className="mt-1 text-xs text-gray-400 capitalize">{d.service_request?.category} · {d.service_request?.priority}</p>
                                    </div>
                                    {d.distance_km && (
                                        <span className="text-sm font-medium text-gray-500">{d.distance_km.toFixed(1)} km</span>
                                    )}
                                </div>
                                <div className="mt-4 flex gap-3">
                                    <button onClick={() => router.put(`/technician/jobs/${d.id}/accept`)}
                                        className="flex-1 rounded-xl bg-schneider-300 py-2 text-sm font-bold text-white hover:bg-schneider-400 transition-colors">
                                        Accept
                                    </button>
                                    <button onClick={() => router.put(`/technician/jobs/${d.id}/reject`)}
                                        className="flex-1 rounded-xl border-2 border-red-300 py-2 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
