'use client'

import { useState } from 'react'
import { X, Package, DollarSign, List, Trash2 } from 'lucide-react'
import { updateProduct, deleteProduct } from '@/lib/actions'

export default function EditProductModal({
    isOpen,
    onClose,
    product
}: {
    isOpen: boolean
    onClose: () => void
    product: any
}) {
    const [loading, setLoading] = useState(false)

    if (!isOpen || !product) return null

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)

        try {
            await updateProduct(product.id, {
                name: formData.get('name') as string,
                totalStock: parseInt(formData.get('totalStock') as string),
                pricePerUnit: parseFloat(formData.get('pricePerUnit') as string),
            })
            onClose()
        } catch (error) {
            alert('Error updating product')
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete() {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return
        setLoading(true)
        try {
            await deleteProduct(product.id)
            onClose()
        } catch (error) {
            alert('Error deleting product. Asegúrate de que no tenga alquileres asociados.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold gradient-text">Editar Producto</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-2">
                            <Package size={14} /> Nombre del Material
                        </label>
                        <input
                            name="name"
                            required
                            defaultValue={product.name}
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 transition-colors outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-2">
                                <List size={14} /> Stock Total
                            </label>
                            <input
                                name="totalStock"
                                type="number"
                                required
                                defaultValue={product.totalStock}
                                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 transition-colors outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-2">
                                <DollarSign size={14} /> Precio Alquiler (€)
                            </label>
                            <input
                                name="pricePerUnit"
                                type="number"
                                step="0.01"
                                required
                                defaultValue={product.pricePerUnit}
                                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 transition-colors outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="flex-1 p-3 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all font-semibold text-sm"
                        >
                            Eliminar
                        </button>
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex-[2] p-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-all font-bold shadow-lg shadow-emerald-500/20"
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
