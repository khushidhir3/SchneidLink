import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

export default function Index({ technicians }) {
    return (
        <AppLayout title="Technician Fleet">
            <Head title="Technician Fleet" />
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {technicians.map(tech => (
                    <div key={tech.id} className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100 flex flex-col items-center text-center hover:border-schneider-300 transition-colors">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-schneider-400 to-schneider-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                            {tech.user?.name.charAt(0)}
                        </div>
                        <h3 className="mt-4 font-bold text-lg text-dark-800">{tech.user?.name}</h3>
                        <p className="text-sm text-gray-500">{tech.employee_code}</p>
                        
                        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                            {tech.skills?.map(skill => (
                                <span key={skill.id} className="px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                        
                        <div className="mt-6 flex w-full justify-between border-t pt-4 text-sm">
                            <div className="text-center">
                                <div className="font-bold text-dark-800">⭐ {tech.rating_avg.toFixed(1)}</div>
                                <div className="text-xs text-gray-500">Rating</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-dark-800">{tech.total_jobs}</div>
                                <div className="text-xs text-gray-500">Jobs</div>
                            </div>
                            <div className="text-center">
                                <div className={`font-bold ${tech.availability_status === 'available' ? 'text-green-500' : 'text-gray-400'}`}>
                                    {tech.availability_status === 'available' ? 'Online' : 'Offline'}
                                </div>
                                <div className="text-xs text-gray-500">Status</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {technicians.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                    No technicians found in the fleet.
                </div>
            )}
        </AppLayout>
    );
}
