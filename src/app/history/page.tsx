import { prisma } from '@/lib/db'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { History as HistoryIcon, Search } from 'lucide-react'
import RentalStatusActions from '@/components/RentalStatusActions'

export const dynamic = 'force-dynamic'

export default async function HistoryPage() {
    const historyRentalsRaw = await prisma.rental.findMany({
        where: { status: { in: ['RETURNED', 'CANCELLED'] } },
        orderBy: { endDate: 'desc' },
        include: {
            client: true,
            items: {
                include: {
                    product: true
                }
            }
        }
    })
    const historyRentals = JSON.parse(JSON.stringify(historyRentalsRaw))

    return (
        <div className="min-h-screen p-8 bg-[#0a0a0c] text-white">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Histórico de Alquileres</h1>
                    <p className="text-slate-400">Registros finalizados o cancelados ({historyRentals.length})</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/rentals" className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/20 hover:bg-blue-600/30 transition-colors text-sm font-semibold">
                        Ver Pedidos Activos
                    </Link>
                    <Link href="/" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors text-sm">
                        Volver al Dashboard
                    </Link>
                </div>
            </header>

            <div className="glass overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-500 text-[10px] uppercase tracking-[0.2em]">
                                <th className="p-6 font-semibold">Identificación</th>
                                <th className="p-6 font-semibold">Resumen de Material</th>
                                <th className="p-6 font-semibold">Importe Final</th>
                                <th className="p-6 font-semibold">Estado Final</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {historyRentals.map((rental: any) => (
                                <tr key={rental.id} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="p-6 text-right" colSpan={4}>
                                        <div className="flex justify-between items-center w-full">
                                            <div className="text-left">
                                                <div className="font-semibold text-slate-200">{rental.client.name}</div>
                                                <div className="text-[10px] text-slate-500 mt-1 uppercase">
                                                    Cerrado el {format(new Date(rental.endDate), 'dd/MM/yyyy')}
                                                </div>
                                            </div>
                                            <div className="text-left">
                                                <div className="text-xs text-slate-400 leading-relaxed max-w-sm">
                                                    {rental.items.map((item: any) => `${item.quantity}x ${item.product.name}`).join(', ')}
                                                </div>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-mono text-sm text-slate-300">{rental.totalPrice.toFixed(2)}€</div>
                                                <div className={`text-[9px] font-bold mt-1 ${rental.paymentStatus ? 'text-emerald-500/60' : 'text-red-500/60'}`}>
                                                    {rental.paymentStatus ? 'PAGADO' : 'PENDIENTE'}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-2 py-0.5 rounded-sm text-[10px] font-black tracking-tighter uppercase border ${rental.status === 'RETURNED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                    {rental.status === 'RETURNED' ? 'FINALIZADO' : 'CANCELADO'}
                                                </span>
                                                <RentalStatusActions rental={rental} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {historyRentals.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-32 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-600">
                                            <HistoryIcon size={48} className="opacity-10" />
                                            <p className="font-medium">No hay registros en el historial todavía.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
