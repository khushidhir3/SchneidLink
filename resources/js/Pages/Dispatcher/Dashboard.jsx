import AppLayout from '@/Layouts/AppLayout';
import StatsCard from '@/Components/StatsCard';
import StatusBadge from '@/Components/StatusBadge';
import PriorityBadge from '@/Components/PriorityBadge';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ stats, pendingRequests, availableTechnicians }) {
    const [selectedRequest, setSelectedRequest] = useState(null);

    const assignTechnician = (requestId, technicianId) => {
        router.post(`/dispatcher/requests/${requestId}/assign`, { technician_id: technicianId });
    };

    return (
        <AppLayout title="Dispatch Center">
            <Head title="Dispatch Center" />

            {/* Stats */}
            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatsCard title="Pending Requests" value={stats.pending_requests} icon="📋" color="orange" />
                <StatsCard title="Available Techs" value={stats.available_technicians} icon="👷" color="schneider" />
                <StatsCard title="In Progress" value={stats.in_progress} icon="🔧" color="purple" />
                <StatsCard title="Completed Today" value={stats.completed_today} icon="✅" color="blue" />
            </div>

            {/* Two-column layout */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Left: Pending Requests */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-dark-800">Pending Requests</h3>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                        {pendingRequests.length === 0 ? (
                            <div className="rounded-2xl bg-white p-8 text-center shadow-md border border-gray-100">
                                <p className="text-gray-400">🎉 No pending requests!</p>
                            </div>
                        ) : pendingRequests.map((req) => (
                            <div key={req.id}
                                onClick={() => setSelectedRequest(req.id === selectedRequest ? null : req.id)}
                                className={`cursor-pointer rounded-2xl bg-white p-5 shadow-md border transition-all hover:shadow-lg ${
                                    selectedRequest === req.id ? 'border-schneider-300 ring-2 ring-schneider-300/20' : 'border-gray-100'
                                }`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-semibold text-dark-800">{req.title}</h4>
                                        <p className="mt-1 text-sm text-gray-500">{req.client?.name}</p>
                                        <p className="text-xs text-gray-400 mt-1">{req.location_address}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <PriorityBadge priority={req.priority} />
                                        <span className="text-xs text-gray-400 capitalize">{req.category}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Available Technicians */}
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-dark-800">Available Technicians</h3>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                        {availableTechnicians.length === 0 ? (
                            <div className="rounded-2xl bg-white p-8 text-center shadow-md border border-gray-100">
                                <p className="text-gray-400">No technicians available</p>
                            </div>
                        ) : availableTechnicians.map((tech, idx) => (
                            <div key={tech.id} className="rounded-2xl bg-white p-5 shadow-md border border-gray-100 transition-all hover:shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-schneider-100 text-sm font-bold text-schneider-600">
                                            {tech.user?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-dark-800">{tech.user?.name}</h4>
                                                {idx === 0 && selectedRequest && (
                                                    <span className="rounded-full bg-schneider-100 px-2 py-0.5 text-[10px] font-bold text-schneider-600">
                                                        Best Match
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                ⭐ {tech.rating_avg?.toFixed(1)} · {tech.total_jobs} jobs · {tech.skills?.map(s => s.name).join(', ') || 'No skills'}
                                            </p>
                                        </div>
                                    </div>
                                    {selectedRequest && (
                                        <button
                                            onClick={() => assignTechnician(selectedRequest, tech.id)}
                                            className="rounded-xl bg-schneider-300 px-4 py-2 text-xs font-bold text-white shadow hover:bg-schneider-400 transition-colors"
                                        >
                                            Assign
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {!selectedRequest && availableTechnicians.length > 0 && (
                        <p className="mt-3 text-center text-xs text-gray-400">← Select a request to assign a technician</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
