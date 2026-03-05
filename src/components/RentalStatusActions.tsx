'use client'

import { useState } from 'react'
import { CheckCircle2, Truck, RotateCcw, XCircle, CreditCard } from 'lucide-react'
import { updateRentalStatus, markAsPaid } from '@/lib/actions'

export default function RentalStatusActions({
    rentalId,
    currentStatus,
    isPaid
}: {
    rentalId: string
    currentStatus: string
    isPaid: boolean
}) {
    const [loading, setLoading] = useState(false)

    const handleStatusUpdate = async (status: any) => {
        setLoading(true)
        try {
            await updateRentalStatus(rentalId, status)
        } finally {
            setLoading(false)
        }
    }

    const handlePaymentUpdate = async () => {
        setLoading(true)
        try {
            await markAsPaid(rentalId)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-wrap gap-2">
            {!isPaid && (
                <button
                    onClick={handlePaymentUpdate}
                    disabled={loading}
                    className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-md border border-amber-500/20 hover:bg-amber-500/30 transition-all text-xs font-bold"
                >
                    <CreditCard size={12} /> Marcar Pagado
                </button>
            )}

            {currentStatus === 'PENDING' && (
                <button
                    onClick={() => handleStatusUpdate('DELIVERED')}
                    disabled={loading}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-md border border-blue-500/20 hover:bg-blue-500/30 transition-all text-xs font-bold"
                >
                    <Truck size={12} /> Enviar/Entregar
                </button>
            )}

            {currentStatus === 'DELIVERED' && (
                <button
                    onClick={() => handleStatusUpdate('RETURNED')}
                    disabled={loading}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/20 hover:bg-emerald-500/30 transition-all text-xs font-bold"
                >
                    <RotateCcw size={12} /> Registrar Devolución
                </button>
            )}

            {(currentStatus === 'PENDING' || currentStatus === 'DELIVERED') && (
                <button
                    onClick={() => handleStatusUpdate('CANCELLED')}
                    disabled={loading}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-md border border-red-500/20 hover:bg-red-500/30 transition-all text-xs font-bold"
                >
                    <XCircle size={12} /> Cancelar
                </button>
            )}
        </div>
    )
}
