import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/StatusBadge';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ users, filters }) {
    const [showCreate, setShowCreate] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', role: 'client', phone: '',
    });

    const handleFilter = (role) => {
        router.get('/admin/users', { role: role || undefined }, { preserveState: true, replace: true });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/admin/users/${id}`, { preserveScroll: true });
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post('/admin/users', { onSuccess: () => { reset(); setShowCreate(false); } });
    };

    return (
        <AppLayout title="User Management">
            <Head title="Users" />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                    {['', 'client', 'technician', 'dispatcher', 'admin'].map(r => (
                        <button key={r} onClick={() => handleFilter(r)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                                (filters.role || '') === r ? 'bg-schneider-300 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}>
                            {r ? r.charAt(0).toUpperCase() + r.slice(1) : 'All'}
                        </button>
                    ))}
                </div>
                <button onClick={() => setShowCreate(!showCreate)}
                    className="rounded-xl bg-gradient-to-r from-schneider-300 to-schneider-500 px-5 py-2 text-sm font-semibold text-white shadow-lg">
                    + Add User
                </button>
            </div>

            {showCreate && (
                <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                    <h3 className="text-sm font-semibold text-dark-800 mb-4">Create New User</h3>
                    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <input placeholder="Name" value={data.name} onChange={e => setData('name', e.target.value)}
                            className="rounded-xl border-gray-200 text-sm focus:border-schneider-300" />
                        <input placeholder="Email" type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                            className="rounded-xl border-gray-200 text-sm focus:border-schneider-300" />
                        <input placeholder="Password" type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                            className="rounded-xl border-gray-200 text-sm focus:border-schneider-300" />
                        <select value={data.role} onChange={e => setData('role', e.target.value)}
                            className="rounded-xl border-gray-200 text-sm focus:border-schneider-300">
                            {['client', 'technician', 'dispatcher', 'admin'].map(r => (
                                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                            ))}
                        </select>
                        <button type="submit" disabled={processing}
                            className="rounded-xl bg-schneider-300 py-2 text-sm font-bold text-white hover:bg-schneider-400">
                            Create
                        </button>
                    </form>
                    {Object.keys(errors).length > 0 && (
                        <div className="mt-2 text-xs text-red-500">{Object.values(errors).join(', ')}</div>
                    )}
                </div>
            )}

            <div className="overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b bg-gray-50/50">
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Name</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Email</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Role</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500">Joined</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.data?.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-medium text-dark-800">{u.name}</td>
                                <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                <td className="px-6 py-4"><StatusBadge status={u.role === 'admin' ? 'completed' : u.role === 'dispatcher' ? 'assigned' : u.role === 'technician' ? 'en_route' : 'pending'} /></td>
                                <td className="px-6 py-4 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(u.id)}
                                        className="rounded bg-red-100 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-200 transition-colors">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
