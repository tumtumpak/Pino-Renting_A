'use client'

import { useState } from 'react'
import { createClient } from '@/lib/actions'
import { X } from 'lucide-react'

export default function NewClientModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        try {
            const result = await createClient(formData)
            if (result?.error) {
                alert(result.error)
            } else {
                onClose()
            }
        } catch (error) {
            alert('Error crítico: No se pudo contactar con el servidor.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold gradient-text">Nuevo Cliente</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Nombre Completo</label>
                        <input
                            name="name"
                            required
                            type="text"
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 transition-colors outline-none"
                            placeholder="Ej: Juan Pérez Hostelería"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">DNI/NIF</label>
                        <input
                            name="dni"
                            required
                            type="text"
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 transition-colors outline-none"
                            placeholder="12345678A"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Observaciones</label>
                        <textarea
                            name="observations"
                            rows={3}
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 transition-colors outline-none resize-none"
                            placeholder="Detalles adicionales del cliente..."
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full p-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all font-bold mt-4 shadow-lg shadow-blue-500/20"
                    >
                        {loading ? 'Guardando...' : 'Crear Cliente'}
                    </button>
                </form>
            </div>
        </div>
    )
}
