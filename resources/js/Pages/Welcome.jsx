import { Head, Link } from '@inertiajs/react';

export default function Welcome({ canLogin, canRegister }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-dark-900 text-white">
                {/* Nav */}
                <nav className="flex items-center justify-between px-6 py-4 lg:px-16">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-schneider-300 to-schneider-500 text-white font-bold shadow-lg">
                            SF
                        </div>
                        <div>
                            <span className="text-lg font-bold">Schneider</span>
                            <span className="ml-1 text-lg font-light text-schneider-300">FieldDispatch</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {canLogin && (
                            <Link href={route('login')} className="rounded-lg px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Log In
                            </Link>
                        )}
                        {canRegister && (
                            <Link href={route('register')} className="rounded-xl bg-gradient-to-r from-schneider-300 to-schneider-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-schneider-300/25 hover:shadow-xl transition-all">
                                Get Started
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Hero */}
                <div className="mx-auto max-w-6xl px-6 py-24 lg:px-16 lg:py-32">
                    <div className="text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-schneider-300/10 px-4 py-1.5 text-sm font-medium text-schneider-300 border border-schneider-300/20">
                            <span className="h-2 w-2 rounded-full bg-schneider-300 animate-pulse" />
                            Schneider Electric · SIH 2019
                        </div>

                        <h1 className="text-5xl font-extrabold leading-tight tracking-tight lg:text-7xl">
                            Dispatch{' '}
                            <span className="bg-gradient-to-r from-schneider-300 to-schneider-100 bg-clip-text text-transparent">
                                Field Technicians
                            </span>
                            <br />Like Never Before
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 leading-relaxed">
                            An Uber-like platform for field service management. Clients request help,
                            dispatchers assign the best-matched technician, and track everything in real-time.
                        </p>

                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            {canRegister && (
                                <Link href={route('register')} className="rounded-2xl bg-gradient-to-r from-schneider-300 to-schneider-500 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-schneider-300/30 transition-all hover:shadow-schneider-300/50 hover:-translate-y-1">
                                    Start Dispatching →
                                </Link>
                            )}
                            {canLogin && (
                                <Link href={route('login')} className="rounded-2xl border-2 border-dark-600 px-8 py-4 text-base font-bold text-gray-300 hover:border-schneider-300 hover:text-schneider-300 transition-all">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Feature cards */}
                    <div className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { icon: '📋', title: 'Service Requests', desc: 'Clients raise requests with location, priority, and category.' },
                            { icon: '🤖', title: 'Smart Matching', desc: 'AI-powered technician matching by skill, distance, and rating.' },
                            { icon: '📍', title: 'Live Tracking', desc: 'Real-time GPS tracking of technicians en route to the site.' },
                            { icon: '📊', title: 'Analytics', desc: 'Comprehensive dashboards for all roles with actionable insights.' },
                        ].map((f, i) => (
                            <div key={i} className="group rounded-2xl bg-dark-800/50 border border-dark-700 p-6 transition-all hover:border-schneider-300/30 hover:bg-dark-800">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dark-700 text-2xl group-hover:bg-schneider-300/10 transition-colors">
                                    {f.icon}
                                </div>
                                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Role cards */}
                    <div className="mt-20">
                        <h2 className="text-center text-2xl font-bold mb-10">Four Roles, One Platform</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                { role: 'Client', color: 'from-blue-400 to-blue-600', icon: '👤', items: ['Raise service requests', 'Track technician live', 'Rate completed jobs'] },
                                { role: 'Technician', color: 'from-schneider-300 to-schneider-500', icon: '🔧', items: ['Accept/reject jobs', 'Navigate to site', 'Update job status'] },
                                { role: 'Dispatcher', color: 'from-purple-400 to-purple-600', icon: '📡', items: ['Assign technicians', 'Monitor all jobs', 'View live map'] },
                                { role: 'Admin', color: 'from-orange-400 to-orange-600', icon: '👑', items: ['Manage all users', 'View analytics', 'Generate reports'] },
                            ].map((r, i) => (
                                <div key={i} className="rounded-2xl bg-dark-800/50 border border-dark-700 p-6 hover:border-dark-600 transition-colors">
                                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${r.color} text-lg text-white shadow-lg`}>
                                        {r.icon}
                                    </div>
                                    <h3 className="mt-3 text-lg font-bold">{r.role}</h3>
                                    <ul className="mt-3 space-y-1.5">
                                        {r.items.map((item, j) => (
                                            <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                                                <span className="text-schneider-300">✓</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-dark-800 px-6 py-8 text-center">
                    <p className="text-sm text-gray-600">
                        Schneider FieldDispatch · Smart India Hackathon 2019 · Built with Laravel, Inertia, React
                    </p>
                </footer>
            </div>
        </>
    );
}
