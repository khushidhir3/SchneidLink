export default function StatsCard({ title, value, icon, trend, color = 'schneider' }) {
    const colorMap = {
        schneider: 'from-schneider-300 to-schneider-500',
        blue:      'from-blue-400 to-blue-600',
        purple:    'from-purple-400 to-purple-600',
        orange:    'from-orange-400 to-orange-600',
        red:       'from-red-400 to-red-600',
        indigo:    'from-indigo-400 to-indigo-600',
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${colorMap[color]} opacity-10`} />
            <div className="relative">
                <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colorMap[color]} text-white text-xl shadow-lg`}>
                        {icon}
                    </div>
                    {trend !== undefined && (
                        <span className={`text-xs font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                        </span>
                    )}
                </div>
                <div className="mt-4">
                    <p className="text-3xl font-bold text-dark-800">{value}</p>
                    <p className="mt-1 text-sm font-medium text-gray-500">{title}</p>
                </div>
            </div>
        </div>
    );
}
