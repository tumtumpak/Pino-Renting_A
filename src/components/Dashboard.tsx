import { Package, Users, Calendar, TrendingUp, AlertCircle, History as HistoryIcon, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import Link from 'next/link';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell 
} from 'recharts';

interface DashboardProps {
    stats: {
        activeRentals: number
        totalProducts: number
        totalClients: number
        pendingPayments: number
    }
    recentRentals: any[]
    chartData: any[]
    topProducts: any[]
    onAction: (action: 'client' | 'product' | 'rental') => void
}

export default function Dashboard({ stats, recentRentals, chartData, topProducts, onAction }: DashboardProps) {
    const COLORS = ['#60a5fa', '#34d399', '#818cf8', '#f59e0b', '#ec4899'];

    return (
        <div className="min-h-screen p-8 bg-[#0a0a0c] text-white">
            {/* Header */}
            <header className="mb-12">
                <h1 className="text-4xl font-bold gradient-text mb-2">Pino-Renting</h1>
                <p className="text-slate-400">Panel de Control de Gestión de Hostelería</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Link href="/rentals" className="block">
                    <StatCard
                        title="Alquileres Activos"
                        value={stats.activeRentals.toString()}
                        icon={<Calendar className="text-blue-400" />}
                        trend="Ver Pedidos"
                    />
                </Link>
                <Link href="/products" className="block">
                    <StatCard
                        title="Productos en Stock"
                        value={stats.totalProducts.toLocaleString()}
                        icon={<Package className="text-emerald-400" />}
                        trend="Ver Inventario"
                    />
                </Link>
                <Link href="/clients" className="block">
                    <StatCard
                        title="Clientes Totales"
                        value={stats.totalClients.toString()}
                        icon={<Users className="text-indigo-400" />}
                        trend="Ver Directorio"
                    />
                </Link>
                <Link href="/payments" className="block">
                    <StatCard
                        title="Pendiente Cobro"
                        value={`${stats.pendingPayments} €`}
                        icon={<AlertCircle className="text-amber-400" />}
                        trend="Total impagos"
                    />
                </Link>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="glass p-6">
                  <div className="flex items-center gap-2 mb-6 text-blue-400">
                    <LineChartIcon size={20} />
                    <h2 className="text-xl font-semibold text-white">Tendencia de Ingresos</h2>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis 
                          dataKey="month" 
                          stroke="#94a3b8" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <YAxis 
                          stroke="#94a3b8" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          tickFormatter={(value) => `${value}€`}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                          itemStyle={{ color: '#60a5fa' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#60a5fa" 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: '#60a5fa', strokeWidth: 2, stroke: '#0a0a0c' }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass p-6">
                  <div className="flex items-center gap-2 mb-6 text-emerald-400">
                    <BarChart3 size={20} />
                    <h2 className="text-xl font-semibold text-white">Top Productos (Cant. Alquilada)</h2>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topProducts} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          stroke="#94a3b8" 
                          fontSize={12} 
                          width={100}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                          {topProducts.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 glass p-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-400" />
                        Alquileres Próximos
                    </h2>
                    <div className="space-y-4">
                        {recentRentals.length > 0 ? recentRentals.map((rental: any) => (
                            <div key={rental.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-blue-500/30 transition-colors cursor-pointer">
                                <div>
                                    <p className="font-medium">{rental.venue || 'Evento sin lugar'}</p>
                                    <p className="text-sm text-slate-400">
                                        Cliente: {rental.client.name} • {new Date(rental.startDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${rental.status === 'PENDING' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                    rental.status === 'DELIVERED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    }`}>
                                    {rental.status}
                                </span>
                            </div>
                        )) : (
                            <p className="text-slate-500 text-center py-8 italic">No hay alquileres próximos registrados.</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass p-6">
                    <h2 className="text-xl font-semibold mb-6">Acciones Rápidas</h2>
                    <div className="space-y-3">
                        <button
                            onClick={() => onAction('rental')}
                            className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <Calendar size={18} />
                            Nuevo Alquiler
                        </button>
                        <button
                            onClick={() => onAction('client')}
                            className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors font-medium border border-white/10 flex items-center justify-center gap-2"
                        >
                            <Users size={18} />
                            Nuevo Cliente
                        </button>
                        <button
                            onClick={() => onAction('product')}
                            className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors font-medium border border-white/10 flex items-center justify-center gap-2"
                        >
                            <Package size={18} />
                            Añadir Producto
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-center">
                <Link href="/history" className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-semibold uppercase tracking-widest flex items-center gap-2">
                    Ver Todo el Historial <HistoryIcon size={12} />
                </Link>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
    return (
        <div className="glass p-6 hover-scale">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    {icon}
                </div>
                <span className="text-xs text-slate-500">{trend}</span>
            </div>
            <div>
                <p className="text-sm text-slate-400 mb-1">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
}
