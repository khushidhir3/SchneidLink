import AppLayout from '@/Layouts/AppLayout';
import MapView from '@/Components/MapView';
import StatusBadge from '@/Components/StatusBadge';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const steps = ['pending', 'assigned', 'en_route', 'arrived', 'completed'];
const stepLabels = { pending: 'Pending', assigned: 'Assigned', en_route: 'En Route', arrived: 'Arrived', completed: 'Completed' };

export default function Track({ serviceRequest }) {
    const dispatch = serviceRequest.dispatch;
    const [techLocation, setTechLocation] = useState(
        dispatch?.technician ? { lat: dispatch.technician.current_lat, lng: dispatch.technician.current_lng } : null
    );

    const currentStep = dispatch ? steps.indexOf(dispatch.status) : 0;
    const isCompleted = dispatch?.status === 'completed';
    const showMap = dispatch && ['en_route', 'arrived'].includes(dispatch.status);

    // Rating form
    const { data, setData, post, processing } = useForm({ score: 5, comment: '' });

    // Real-time location updates
    useEffect(() => {
        if (!window.Echo || !serviceRequest.id) return;
        const channel = window.Echo.private(`request.${serviceRequest.id}`);

        channel.listen('.technician.location.updated', (e) => {
            setTechLocation({ lat: e.lat, lng: e.lng });
        });
        channel.listen('.dispatch.status.updated', () => {
            window.location.reload(); // Simple reload on status change
        });

        return () => {
            channel.stopListening('.technician.location.updated');
            channel.stopListening('.dispatch.status.updated');
        };
    }, [serviceRequest.id]);

    const markers = [];
    // Client location
    markers.push({ lat: serviceRequest.location_lat, lng: serviceRequest.location_lng, color: 'blue', popup: `<b>Job Site</b><br/>${serviceRequest.location_address}` });
    // Technician location
    if (techLocation?.lat && techLocation?.lng) {
        markers.push({ lat: techLocation.lat, lng: techLocation.lng, color: 'green', popup: `<b>Technician</b><br/>${dispatch?.technician?.user?.name || 'En Route'}` });
    }

    const submitRating = (e) => {
        e.preventDefault();
        post(`/requests/${serviceRequest.id}/rate`);
    };

    return (
        <AppLayout title="Track Request">
            <Head title="Track Request" />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left: Details & Timeline */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Request Info */}
                    <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                        <h3 className="text-lg font-bold text-dark-800">{serviceRequest.title}</h3>
                        <p className="mt-2 text-sm text-gray-600">{serviceRequest.description}</p>
                        <div className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Category</span><span className="capitalize font-medium">{serviceRequest.category}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Status</span><StatusBadge status={serviceRequest.status} /></div>
                            <div className="flex justify-between"><span className="text-gray-500">Address</span><span className="font-medium text-right max-w-[180px] truncate">{serviceRequest.location_address}</span></div>
                        </div>
                        {dispatch?.technician?.user && (
                            <div className="mt-4 rounded-xl bg-schneider-50/50 p-3 border border-schneider-100">
                                <p className="text-xs font-medium text-gray-500 mb-1">Assigned Technician</p>
                                <p className="text-sm font-semibold text-dark-800">{dispatch.technician.user.name}</p>
                            </div>
                        )}
                    </div>

                    {/* Status Timeline */}
                    <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                        <h4 className="text-sm font-semibold text-dark-800 mb-4">Progress</h4>
                        <div className="space-y-0">
                            {steps.map((step, i) => (
                                <div key={step} className="flex items-start gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                            i <= currentStep ? 'bg-schneider-300 text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            {i < currentStep ? '✓' : i + 1}
                                        </div>
                                        {i < steps.length - 1 && (
                                            <div className={`w-0.5 h-8 ${i < currentStep ? 'bg-schneider-300' : 'bg-gray-200'}`} />
                                        )}
                                    </div>
                                    <div className="pt-1">
                                        <p className={`text-sm font-medium ${i <= currentStep ? 'text-dark-800' : 'text-gray-400'}`}>
                                            {stepLabels[step]}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rating form */}
                    {isCompleted && !dispatch?.rating && (
                        <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                            <h4 className="text-sm font-semibold text-dark-800 mb-4">Rate Your Experience</h4>
                            <form onSubmit={submitRating} className="space-y-4">
                                <div className="flex gap-1">
                                    {[1,2,3,4,5].map(star => (
                                        <button key={star} type="button" onClick={() => setData('score', star)}
                                            className={`text-3xl transition-transform hover:scale-110 ${star <= data.score ? 'text-yellow-400' : 'text-gray-200'}`}>
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <textarea value={data.comment} onChange={e => setData('comment', e.target.value)}
                                    rows={3} placeholder="Leave a comment (optional)"
                                    className="w-full rounded-xl border-gray-200 text-sm focus:border-schneider-300 focus:ring-schneider-300" />
                                <button type="submit" disabled={processing}
                                    className="w-full rounded-xl bg-schneider-300 py-2 text-sm font-semibold text-white hover:bg-schneider-400 transition-colors">
                                    Submit Rating
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Right: Map */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl bg-white p-4 shadow-lg border border-gray-100">
                        <h4 className="text-sm font-semibold text-dark-800 mb-3">
                            {showMap ? '🔴 Live Tracking' : 'Job Location'}
                        </h4>
                        <MapView markers={markers} height="500px" center={[serviceRequest.location_lat, serviceRequest.location_lng]} zoom={14} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
