'use client'

import { useState } from 'react'
import { X, User, CreditCard, MessageSquare } from 'lucide-react'
import { updateClient, deleteClient } from '@/lib/actions'

export default function EditClientModal({
    isOpen,
    onClose,
    client
}: {
    isOpen: boolean
    onClose: () => void
    client: any
}) {
    const [loading, setLoading] = useState(false)

    if (!isOpen || !client) return null

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)

        try {
            await updateClient(client.id, {
                name: formData.get('name') as string,
                dni: formData.get('dni') as string,
                observations: formData.get('observations') as string,
            })
            onClose()
        } catch (error) {
            alert('Error updating client')
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete() {
        if (!confirm('¿Estás seguro de eliminar este cliente?')) return
        setLoading(true)
        try {
            await deleteClient(client.id)
            onClose()
        } catch (error) {
            alert('Error deleting client')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold gradient-text">Editar Cliente</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-2">
                            <User size={14} /> Nombre Completo
                        </label>
                        <input
                            name="name"
                            required
                            defaultValue={client.name}
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 transition-colors outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-2">
                            <CreditCard size={14} /> DNI / NIF
                        </label>
                        <input
                            name="dni"
                            required
                            defaultValue={client.dni}
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 transition-colors outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center gap-2">
                            <MessageSquare size={14} /> Observaciones
                        </label>
                        <textarea
                            name="observations"
                            defaultValue={client.observations}
                            rows={3}
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 transition-colors outline-none resize-none"
                        ></textarea>
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
                            className="flex-[2] p-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all font-bold shadow-lg shadow-blue-500/20"
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
