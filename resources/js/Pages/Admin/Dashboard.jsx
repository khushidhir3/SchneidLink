import AppLayout from '@/Layouts/AppLayout';
import StatsCard from '@/Components/StatsCard';
import { Head } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3DCD58', '#3b82f6', '#8b5cf6', '#f97316', '#ef4444', '#06b6d4', '#6b7280'];

export default function Dashboard({ stats, chartData, categoryBreakdown, topTechnicians }) {
    const pieData = Object.entries(categoryBreakdown).map(([name, value]) => ({ name: name.toUpperCase(), value }));

    return (
        <AppLayout title="Admin Dashboard">
            <Head title="Admin Dashboard" />

            <div className="mb-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
                <StatsCard title="Total Users" value={stats.total_users} icon="👥" color="blue" />
                <StatsCard title="Technicians" value={stats.total_technicians} icon="👷" color="schneider" />
                <StatsCard title="All-Time Jobs" value={stats.total_jobs} icon="📋" color="purple" />
                <StatsCard title="Avg Rating" value={stats.avg_rating?.toFixed(1) || '0.0'} icon="⭐" color="orange" />
            </div>

            <div className="mb-8 grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                    <h3 className="text-sm font-semibold text-dark-800 mb-4">Jobs Completed — Last 30 Days</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
                            <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="jobs" stroke="#3DCD58" strokeWidth={2.5} dot={{ r: 3, fill: '#3DCD58' }} activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                    <h3 className="text-sm font-semibold text-dark-800 mb-4">Jobs by Category</h3>
                    {pieData.length === 0 ? (
                        <p className="text-center text-gray-400 mt-8">No data yet</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend wrapperStyle={{ fontSize: '11px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                <h3 className="text-sm font-semibold text-dark-800 mb-4">Top 5 Technicians</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b bg-gray-50/50">
                                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">#</th>
                                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">Name</th>
                                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">Code</th>
                                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">Jobs</th>
                                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">Rating</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {topTechnicians.length === 0 ? (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No data yet</td></tr>
                            ) : topTechnicians.map((t, i) => (
                                <tr key={i} className="hover:bg-gray-50/50">
                                    <td className="px-4 py-3 font-bold text-schneider-300">{i + 1}</td>
                                    <td className="px-4 py-3 font-medium text-dark-800">{t.name}</td>
                                    <td className="px-4 py-3 text-gray-500">{t.employee_code}</td>
                                    <td className="px-4 py-3">{t.total_jobs}</td>
                                    <td className="px-4 py-3">⭐ {t.rating_avg?.toFixed(1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
