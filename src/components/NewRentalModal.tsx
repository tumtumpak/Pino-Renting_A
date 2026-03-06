'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Calendar, Users, Package } from 'lucide-react'
import { createRental } from '@/lib/actions'

interface Product {
    id: string
    name: string
    pricePerUnit: number
    totalStock: number
}

interface Client {
    id: string
    name: string
}

export default function NewRentalModal({
    isOpen,
    onClose,
    clients,
    products
}: {
    isOpen: boolean
    onClose: () => void
    clients: Client[]
    products: Product[]
}) {
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState<{ productId: string, quantity: number }[]>([])
    const [selectedClientId, setSelectedClientId] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [venue, setVenue] = useState('')
    const [observations, setObservations] = useState('')

    if (!isOpen) return null

    const addItem = () => {
        setItems([...items, { productId: '', quantity: 1 }])
    }

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, field: 'productId' | 'quantity', value: string | number) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        setItems(newItems)
    }

    const calculateTotal = () => {
        return items.reduce((total, item) => {
            const product = products.find(p => p.id === item.productId)
            return total + (product?.pricePerUnit || 0) * item.quantity
        }, 0).toFixed(2)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!selectedClientId || items.length === 0 || !startDate || !endDate) return

        setLoading(true)
        try {
            const response = await createRental({
                clientId: selectedClientId,
                startDate,
                endDate,
                venue,
                observations,
                items
            })

            if (response && (response as any).error) {
                throw new Error((response as any).error)
            }

            onClose()
            setItems([])
            setSelectedClientId('')
        } catch (error: any) {
            console.error('Submission error:', error)
            alert('Error al crear el alquiler: ' + (error.message || 'Error desconocido del servidor'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass w-full max-w-2xl p-8 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold gradient-text">Nuevo Alquiler</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-2">
                                <Users size={14} /> Cliente
                            </label>
                            <select
                                required
                                value={selectedClientId}
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                className="w-full p-4 rounded-lg bg-slate-800 text-white border-none outline-none focus:ring-2 focus:ring-blue-500 shadow-xl"
                                style={{ colorScheme: 'dark' }}
                            >
                                <option value="">Seleccionar cliente...</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Lugar del Evento</label>
                            <input
                                type="text"
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 transition-colors outline-none"
                                placeholder="Ej: Hotel Palace"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-2">
                                <Calendar size={14} /> Fecha Inicio
                            </label>
                            <input
                                type="date"
                                required
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 transition-colors outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-2">
                                <Calendar size={14} /> Fecha Fin
                            </label>
                            <input
                                type="date"
                                required
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 transition-colors outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                <Package size={14} /> Material a Alquilar
                            </label>
                            <button
                                type="button"
                                onClick={addItem}
                                className="text-xs px-3 py-1 bg-blue-600/20 text-blue-400 rounded-md border border-blue-500/20 hover:bg-blue-600/30 transition-all font-semibold"
                            >
                                + Añadir Producto
                            </button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div key={index} className="flex gap-3 items-end group">
                                    <div className="flex-1">
                                        <select
                                            required
                                            value={item.productId}
                                            onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                            className="w-full p-4 rounded-lg bg-slate-800 text-white border-none outline-none focus:ring-2 focus:ring-blue-500"
                                            style={{ colorScheme: 'dark' }}
                                        >
                                            <option value="">Producto...</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} ({p.pricePerUnit}€)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-24">
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 transition-colors outline-none"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="p-3 text-slate-500 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                            {items.length === 0 && (
                                <p className="text-slate-500 text-sm italic text-center py-4 bg-white/5 rounded-lg border border-dashed border-white/10">
                                    Selecciona el material para este alquiler.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-slate-400 font-medium">Precio Total Estimado:</span>
                            <span className="text-2xl font-bold text-blue-400">{calculateTotal()} €</span>
                        </div>
                        <button
                            disabled={loading || items.length === 0}
                            type="submit"
                            className="w-full p-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all font-bold shadow-lg shadow-blue-500/20"
                        >
                            {loading ? 'Validando Stock y Guardando...' : 'Confirmar Alquiler'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
