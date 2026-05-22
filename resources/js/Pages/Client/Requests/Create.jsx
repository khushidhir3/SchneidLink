import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '', description: '', category: 'electrical', priority: 'medium',
        location_lat: '', location_lng: '', location_address: '', attachments: [],
    });

    const [geoLoading, setGeoLoading] = useState(false);

    const useMyLocation = () => {
        if (!navigator.geolocation) return alert('Geolocation not supported');
        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setData(prev => ({ ...prev, location_lat: pos.coords.latitude, location_lng: pos.coords.longitude }));
                setGeoLoading(false);
            },
            () => { alert('Could not get location'); setGeoLoading(false); }
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post('/requests');
    };

    const categories = ['electrical', 'hvac', 'plc', 'transformer', 'inspection', 'networking', 'other'];
    const priorities = ['low', 'medium', 'high', 'urgent'];

    return (
        <AppLayout title="New Service Request">
            <Head title="New Request" />

            <div className="mx-auto max-w-2xl">
                <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold text-dark-800 mb-6">Create Service Request</h2>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)}
                                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-schneider-300 focus:ring-schneider-300"
                                placeholder="Brief description of the issue" />
                            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)}
                                rows={4} className="w-full rounded-xl border-gray-200 shadow-sm focus:border-schneider-300 focus:ring-schneider-300"
                                placeholder="Detailed description of the service needed..." />
                            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select value={data.category} onChange={e => setData('category', e.target.value)}
                                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-schneider-300 focus:ring-schneider-300">
                                    {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select value={data.priority} onChange={e => setData('priority', e.target.value)}
                                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-schneider-300 focus:ring-schneider-300">
                                    {priorities.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location Address</label>
                            <input type="text" value={data.location_address} onChange={e => setData('location_address', e.target.value)}
                                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-schneider-300 focus:ring-schneider-300"
                                placeholder="Enter site address" />
                            {errors.location_address && <p className="mt-1 text-xs text-red-500">{errors.location_address}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                <input type="number" step="any" value={data.location_lat} onChange={e => setData('location_lat', e.target.value)}
                                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-schneider-300 focus:ring-schneider-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                <input type="number" step="any" value={data.location_lng} onChange={e => setData('location_lng', e.target.value)}
                                    className="w-full rounded-xl border-gray-200 shadow-sm focus:border-schneider-300 focus:ring-schneider-300" />
                            </div>
                        </div>

                        <button type="button" onClick={useMyLocation} disabled={geoLoading}
                            className="inline-flex items-center gap-2 rounded-xl border border-schneider-300 px-4 py-2 text-sm font-medium text-schneider-300 hover:bg-schneider-50 transition-colors disabled:opacity-50">
                            📍 {geoLoading ? 'Getting location...' : 'Use My Location'}
                        </button>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Attachments (optional)</label>
                            <input type="file" multiple onChange={e => setData('attachments', Array.from(e.target.files))}
                                className="w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-schneider-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-schneider-600 hover:file:bg-schneider-100" />
                        </div>

                        <button type="submit" disabled={processing}
                            className="w-full rounded-xl bg-gradient-to-r from-schneider-300 to-schneider-500 py-3 text-sm font-semibold text-white shadow-lg shadow-schneider-300/25 transition-all hover:shadow-xl disabled:opacity-50">
                            {processing ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
