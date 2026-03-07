'use client'

import React from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface DocumentViewProps {
    type: 'INVOICE' | 'DELIVERY_NOTE'
    data: {
        number: string
        date: Date
        client: {
            name: string
            dni: string
        }
        rental: {
            startDate: Date
            endDate: Date
            venue: string
            totalPrice: number
        }
        items: {
            productName: string
            quantity: number
            pricePerUnit: number
        }[]
    }
}

export default function DocumentView({ type, data }: DocumentViewProps) {
    const isInvoice = type === 'INVOICE'

    return (
        <div className="bg-white text-slate-900 p-8 max-w-4xl mx-auto shadow-lg print:shadow-none print:p-0 font-sans min-h-[29.7cm]">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-200 pb-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight uppercase">
                        {isInvoice ? 'Factura de Alquiler' : 'Albarán de Entrega'}
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">#{data.number}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-blue-600">PINO-RENTING</h2>
                    <p className="text-sm text-slate-500">Coria del Río, Sevilla</p>
                    <p className="text-sm text-slate-500">info@pino-renting.com</p>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-12 mb-10">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Cliente</h3>
                    <p className="text-lg font-bold text-slate-800">{data.client.name}</p>
                    <p className="text-slate-600">DNI: {data.client.dni}</p>
                </div>
                <div className="text-right">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Detalles</h3>
                    <p className="text-slate-600">Fecha Emisión: <span className="text-slate-800 font-medium">{format(data.date, "d 'de' MMMM, yyyy", { locale: es })}</span></p>
                    <p className="text-slate-600">Evento: <span className="text-slate-800 font-medium">{data.rental.venue}</span></p>
                </div>
            </div>

            {/* Table */}
            <div className="mb-10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-slate-800">
                            <th className="py-4 text-xs font-bold text-slate-800 uppercase tracking-wider">Concepto / Producto</th>
                            <th className="py-4 text-right text-xs font-bold text-slate-800 uppercase tracking-wider">Cant.</th>
                            {isInvoice && (
                                <>
                                    <th className="py-4 text-right text-xs font-bold text-slate-800 uppercase tracking-wider">Precio Ud.</th>
                                    <th className="py-4 text-right text-xs font-bold text-slate-800 uppercase tracking-wider">Subtotal</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-slate-100 italic">
                                <td className="py-4 text-slate-700 font-medium">{item.productName}</td>
                                <td className="py-4 text-right text-slate-600">{item.quantity}</td>
                                {isInvoice && (
                                    <>
                                        <td className="py-4 text-right text-slate-600">{item.pricePerUnit.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€</td>
                                        <td className="py-4 text-right text-slate-900 font-bold">{(item.quantity * item.pricePerUnit).toLocaleString('es-ES', { minimumFractionDigits: 2 })}€</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals & Footer */}
            <div className="flex flex-col items-end pt-6 border-t-2 border-slate-800">
                {isInvoice ? (
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between text-slate-500">
                            <span>Base Imponible:</span>
                            <span>{(data.rental.totalPrice / 1.21).toLocaleString('es-ES', { minimumFractionDigits: 2 })}€</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>IVA (21%):</span>
                            <span>{(data.rental.totalPrice - (data.rental.totalPrice / 1.21)).toLocaleString('es-ES', { minimumFractionDigits: 2 })}€</span>
                        </div>
                        <div className="flex justify-between text-xl font-black text-slate-900 pt-2 border-t border-slate-200">
                            <span>TOTAL:</span>
                            <span>{data.rental.totalPrice.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€</span>
                        </div>
                        <div className="mt-8 text-xs text-right text-slate-400 italic">
                            Pagado mediante sistema de gestión Pino-Renting.
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex justify-between items-end mt-20">
                        <div className="border-t border-slate-300 w-48 text-center pt-2">
                            <p className="text-xs text-slate-400 uppercase font-bold">Firma Transportista</p>
                        </div>
                        <div className="border-t border-slate-300 w-48 text-center pt-2">
                            <p className="text-xs text-slate-400 uppercase font-bold">Conformidad Cliente</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-auto pt-20 text-center text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                Pino-Renting - Soluciones de Alquiler Profesional para Eventos
            </div>
        </div>
    )
}
