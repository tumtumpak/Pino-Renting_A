'use client'

import { useState } from 'react'
import { CheckCircle2, Truck, RotateCcw, XCircle, CreditCard, FileText, Printer } from 'lucide-react'
import { updateRentalStatus, markAsPaid } from '@/lib/actions'
import DocumentView from './documents/DocumentView'

export default function RentalStatusActions({
    rental,
}: {
    rental: any
}) {
    const [loading, setLoading] = useState(false)
    const [showDoc, setShowDoc] = useState<'INVOICE' | 'DELIVERY_NOTE' | null>(null)

    const handleStatusUpdate = async (status: any) => {
        setLoading(true)
        try {
            await updateRentalStatus(rental.id, status)
        } finally {
            setLoading(false)
        }
    }

    const handlePaymentUpdate = async () => {
        setLoading(true)
        try {
            await markAsPaid(rental.id)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-wrap gap-2">
            {!rental.paymentStatus && (
                <button
                    onClick={handlePaymentUpdate}
                    disabled={loading}
                    className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-md border border-amber-500/20 hover:bg-amber-500/30 transition-all text-xs font-bold"
                >
                    <CreditCard size={12} /> Marcar Pagado
                </button>
            )}

            {rental.status === 'PENDING' && (
                <button
                    onClick={() => handleStatusUpdate('DELIVERED')}
                    disabled={loading}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-md border border-blue-500/20 hover:bg-blue-500/30 transition-all text-xs font-bold"
                >
                    <Truck size={12} /> Enviar/Entregar
                </button>
            )}

            {rental.status === 'DELIVERED' && (
                <>
                    <button
                        onClick={() => setShowDoc('DELIVERY_NOTE')}
                        className="flex items-center gap-1 px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-md border border-indigo-500/20 hover:bg-indigo-500/30 transition-all text-xs font-bold"
                    >
                        <FileText size={12} /> Ver Albarán
                    </button>
                    <button
                        onClick={() => handleStatusUpdate('RETURNED')}
                        disabled={loading}
                        className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/20 hover:bg-emerald-500/30 transition-all text-xs font-bold"
                    >
                        <RotateCcw size={12} /> Registrar Devolución
                    </button>
                </>
            )}

            {rental.paymentStatus && rental.invoiceNumber && (
                <button
                    onClick={() => setShowDoc('INVOICE')}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-md border border-purple-500/20 hover:bg-purple-500/30 transition-all text-xs font-bold"
                >
                    <FileText size={12} /> Ver Factura
                </button>
            )}

            {(rental.status === 'PENDING' || rental.status === 'DELIVERED') && (
                <button
                    onClick={() => handleStatusUpdate('CANCELLED')}
                    disabled={loading}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-md border border-red-500/20 hover:bg-red-500/30 transition-all text-xs font-bold"
                >
                    <XCircle size={12} /> Cancelar
                </button>
            )}

            {/* Modal de Documento */}
            {showDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl my-8">
                        <div className="sticky top-0 right-0 p-4 flex justify-end gap-3 bg-slate-100/80 backdrop-blur rounded-t-xl border-b border-slate-200 z-10 print:hidden">
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-500/20"
                            >
                                <Printer size={18} /> Imprimir / PDF
                            </button>
                            <button
                                onClick={() => setShowDoc(null)}
                                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all font-bold"
                            >
                                Cerrar
                            </button>
                        </div>
                        <div className="p-0 print:m-0">
                            <DocumentView
                                type={showDoc}
                                data={{
                                    number: showDoc === 'INVOICE' ? rental.invoiceNumber : rental.deliveryNoteNumber,
                                    date: showDoc === 'INVOICE' ? new Date(rental.invoiceDate || Date.now()) : new Date(),
                                    client: rental.client,
                                    rental: {
                                        startDate: new Date(rental.startDate),
                                        endDate: new Date(rental.endDate),
                                        venue: rental.venue || 'No especificado',
                                        totalPrice: rental.totalPrice
                                    },
                                    items: rental.items.map((item: any) => ({
                                        productName: item.product.name,
                                        quantity: item.quantity,
                                        pricePerUnit: item.product.pricePerUnit
                                    }))
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
