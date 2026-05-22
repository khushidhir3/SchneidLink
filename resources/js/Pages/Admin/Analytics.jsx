import AppLayout from '@/Layouts/AppLayout';
import StatsCard from '@/Components/StatsCard';
import { Head } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3DCD58', '#3b82f6', '#8b5cf6', '#f97316', '#ef4444', '#06b6d4', '#6b7280'];

export default function Analytics({ chartData, categoryBreakdown, topTechnicians }) {
    const pieData = Object.entries(categoryBreakdown).map(([name, value]) => ({ name: name.toUpperCase(), value }));

    return (
        <AppLayout title="Analytics">
            <Head title="Analytics" />

            <div className="space-y-8">
                <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-dark-800 mb-4">Jobs Completed — Last 30 Days</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="jobs" stroke="#3DCD58" strokeWidth={3} dot={{ r: 4, fill: '#3DCD58' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                        <h3 className="text-lg font-semibold text-dark-800 mb-4">Category Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
                                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip /><Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                        <h3 className="text-lg font-semibold text-dark-800 mb-4">Top Technicians</h3>
                        <div className="space-y-3">
                            {topTechnicians.map((t, i) => (
                                <div key={i} className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-schneider-100 text-sm font-bold text-schneider-600">
                                        #{i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-dark-800">{t.name}</p>
                                        <p className="text-xs text-gray-500">{t.total_jobs} jobs · ⭐ {t.rating_avg?.toFixed(1)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
