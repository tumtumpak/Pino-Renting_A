import { prisma } from '@/lib/db'
import RentalStatusActions from '@/components/RentalStatusActions'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { AlertCircle, CreditCard } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function PaymentsPage() {
    const unpaidRentals = await prisma.rental.findMany({
        where: { paymentStatus: false },
        orderBy: { startDate: 'desc' },
        include: {
            client: true,
            items: {
                include: {
                    product: true
                }
            }
        }
    })

    const totalPending = unpaidRentals.reduce((sum: number, r: any) => sum + r.totalPrice, 0)
    islands: true

    return (
        <div className="min-h-screen p-8 bg-[#0a0a0c] text-white">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Cobros Pendientes</h1>
                    <div className="flex items-center gap-4 mt-1">
                        <p className="text-slate-400">Total: {unpaidRentals.length} facturas pendientes</p>
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-xs font-bold">
                            Total a cobrar: {totalPending.toFixed(2)}€
                        </span>
                    </div>
                </div>
                <Link href="/" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors text-sm">
                    Volver al Dashboard
                </Link>
            </header>

            <div className="glass overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase tracking-widest">
                                <th className="p-4 font-semibold">Cliente / Evento</th>
                                <th className="p-4 font-semibold">Importe</th>
                                <th className="p-4 font-semibold">Estado Alquiler</th>
                                <th className="p-4 font-semibold text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {unpaidRentals.map((rental: any) => (
                                <tr key={rental.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold flex items-center gap-2">
                                            <CreditCard size={14} className="text-amber-400" />
                                            {rental.client.name}
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-0.5">
                                            {rental.venue || 'Sin lugar especificado'} • {format(new Date(rental.startDate), 'dd MMM yyyy', { locale: es })}
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono font-bold text-amber-400">
                                        {rental.totalPrice.toFixed(2)}€
                                    </td>
                                    <td className="p-4">
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 uppercase font-bold">
                                            {rental.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <RentalStatusActions
                                            rental={rental}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {unpaidRentals.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-500">
                                            <AlertCircle size={32} className="opacity-20" />
                                            <p className="italic">¡Excelente! No hay cobros pendientes.</p>
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
