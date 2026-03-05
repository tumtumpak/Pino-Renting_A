import { Package, Users, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen p-8 bg-[#0a0a0c] text-white">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold gradient-text mb-2">Pino-Renting</h1>
        <p className="text-slate-400">Panel de Control de Gestión de Hostelería</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Alquileres Activos"
          value="24"
          icon={<Calendar className="text-blue-400" />}
          trend="+12% vs mes pasado"
        />
        <StatCard
          title="Productos en Stock"
          value="1,240"
          icon={<Package className="text-emerald-400" />}
          trend="98% disponibilidad"
        />
        <StatCard
          title="Clientes Totales"
          value="86"
          icon={<Users className="text-indigo-400" />}
          trend="5 nuevos hoy"
        />
        <StatCard
          title="Pendiente Cobro"
          value="1.450 €"
          icon={<AlertCircle className="text-amber-400" />}
          trend="3 pedidos urgetes"
        />
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-blue-500/30 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium">Evento Boda - Hotel Palace</p>
                  <p className="text-sm text-slate-400">Cliente: Juan Pérez • 15 Mar - 18 Mar</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Pendiente Entrega
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass p-6">
          <h2 className="text-xl font-semibold mb-6">Acciones Rápidas</h2>
          <div className="space-y-3">
            <button className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors font-medium flex items-center justify-center gap-2">
              <Calendar size={18} />
              Nuevo Alquiler
            </button>
            <button className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors font-medium border border-white/10">
              Registrar Devolución
            </button>
            <button className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors font-medium border border-white/10">
              Añadir Producto
            </button>
          </div>
        </div>
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
