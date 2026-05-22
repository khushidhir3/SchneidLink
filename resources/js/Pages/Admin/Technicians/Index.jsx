import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/StatusBadge';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ technicians, skills }) {
    const [showCreate, setShowCreate] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', phone: '', skills: [],
    });

    const toggleSkill = (skillId) => {
        const exists = data.skills.find(s => s.id === skillId);
        if (exists) {
            setData('skills', data.skills.filter(s => s.id !== skillId));
        } else {
            setData('skills', [...data.skills, { id: skillId, proficiency: 'intermediate', experience_years: 0 }]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post('/admin/technicians', { onSuccess: () => { reset(); setShowCreate(false); } });
    };

    return (
        <AppLayout title="Technician Management">
            <Head title="Technicians" />

            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-dark-800">{technicians.length} Technicians</h3>
                <button onClick={() => setShowCreate(!showCreate)}
                    className="rounded-xl bg-gradient-to-r from-schneider-300 to-schneider-500 px-5 py-2 text-sm font-semibold text-white shadow-lg">
                    + Add Technician
                </button>
            </div>

            {showCreate && (
                <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                    <h3 className="text-sm font-semibold text-dark-800 mb-4">Create New Technician</h3>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <input placeholder="Full Name" value={data.name} onChange={e => setData('name', e.target.value)}
                                className="rounded-xl border-gray-200 text-sm focus:border-schneider-300" />
                            <input placeholder="Email" type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                className="rounded-xl border-gray-200 text-sm focus:border-schneider-300" />
                            <input placeholder="Password" type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                                className="rounded-xl border-gray-200 text-sm focus:border-schneider-300" />
                            <input placeholder="Phone" value={data.phone} onChange={e => setData('phone', e.target.value)}
                                className="rounded-xl border-gray-200 text-sm focus:border-schneider-300" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                            <div className="flex flex-wrap gap-2">
                                {skills.map(skill => {
                                    const isSelected = data.skills.some(s => s.id === skill.id);
                                    return (
                                        <button key={skill.id} type="button" onClick={() => toggleSkill(skill.id)}
                                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                                isSelected ? 'bg-schneider-300 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}>
                                            {skill.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <button type="submit" disabled={processing}
                            className="rounded-xl bg-schneider-300 px-6 py-2 text-sm font-bold text-white hover:bg-schneider-400">
                            Create Technician
                        </button>
                    </form>
                    {Object.keys(errors).length > 0 && (
                        <div className="mt-2 text-xs text-red-500">{Object.values(errors).flat().join(', ')}</div>
                    )}
                </div>
            )}

            <div className="overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b bg-gray-50/50">
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Code</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Name</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Skills</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Status</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Rating</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Jobs</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {technicians.map(t => (
                            <tr key={t.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-mono text-xs text-gray-500">{t.employee_code}</td>
                                <td className="px-6 py-4 font-medium text-dark-800">{t.user?.name}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {t.skills?.map(s => (
                                            <span key={s.id} className="rounded-full bg-schneider-50 px-2 py-0.5 text-[10px] font-medium text-schneider-600">
                                                {s.name}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4"><StatusBadge status={t.availability_status} /></td>
                                <td className="px-6 py-4">⭐ {t.rating_avg?.toFixed(1)}</td>
                                <td className="px-6 py-4">{t.total_jobs}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
