import { getRentalsWithItems } from '@/lib/queries'
import RentalStatusActions from '@/components/RentalStatusActions'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function RentalsPage() {
    const rentalsData = await getRentalsWithItems()
    const rentals = JSON.parse(JSON.stringify(rentalsData))

    const getStatusBadge = (status: string) => {
        const styles: any = {
            PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/20',
            DELIVERED: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
            RETURNED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
            CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/20',
        }
        const labels: any = {
            PENDING: 'Pendiente',
            DELIVERED: 'Entregado',
            RETURNED: 'Devuelto',
            CANCELLED: 'Cancelado',
        }
        return (
            <span className={`px-2 py-1 rounded text-xs font-bold border ${styles[status]}`}>
                {labels[status]}
            </span>
        )
    }

    return (
        <div className="min-h-screen p-8 bg-[#0a0a0c] text-white">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Gestión de Alquileres</h1>
                    <p className="text-slate-400">Total: {rentals.length} pedidos registrados</p>
                </div>
                <Link href="/" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
                    Volver al Dashboard
                </Link>
            </header>

            <div className="glass overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400">
                                <th className="p-4 font-medium text-xs">FECHA / CLIENTE</th>
                                <th className="p-4 font-medium text-xs">MATERIAL</th>
                                <th className="p-4 font-medium text-xs">TOTAL</th>
                                <th className="p-4 font-medium text-xs">ESTADO</th>
                                <th className="p-4 font-medium text-xs text-right">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {rentals.map((rental: any) => (
                                <tr key={rental.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold">{rental.client.name}</div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                                            {format(new Date(rental.startDate), 'dd MMM', { locale: es })} - {format(new Date(rental.endDate), 'dd MMM yyyy', { locale: es })}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-xs text-slate-300">
                                            {rental.items.map((item: any) => `${item.quantity}x ${item.product.name}`).join(', ')}
                                        </div>
                                        {rental.venue && <div className="text-[10px] text-blue-400 mt-1">📍 {rental.venue}</div>}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-white">{rental.totalPrice}€</div>
                                        <div className={`text-[10px] font-bold ${rental.paymentStatus ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {rental.paymentStatus ? 'PAGADO' : 'PENDIENTE PAGO'}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {getStatusBadge(rental.status)}
                                    </td>
                                    <td className="p-4 text-right">
                                        <RentalStatusActions
                                            rental={rental}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {rentals.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-slate-500 italic">
                                        No hay alquileres registrados. Crea uno desde el Dashboard.
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
