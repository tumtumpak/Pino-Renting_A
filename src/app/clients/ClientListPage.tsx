'use client'

import { useState } from 'react'
import { Plus, Users, Search, Edit2 } from 'lucide-react'
import Link from 'next/link'
import EditClientModal from '@/components/EditClientModal'

export default function ClientsPage({ clients }: { clients: any[] }) {
    const [editingClient, setEditingClient] = useState<any>(null)

    return (
        <div className="min-h-screen p-8 bg-[#0a0a0c] text-white">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Gestión de Clientes</h1>
                    <p className="text-slate-400">Total: {clients.length} clientes registrados</p>
                </div>
                <Link href="/" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors text-sm">
                    Volver al Dashboard
                </Link>
            </header>

            <div className="glass p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="pb-4 font-medium">Nombre</th>
                                <th className="pb-4 font-medium">DNI/NIF</th>
                                <th className="pb-4 font-medium">Observaciones</th>
                                <th className="pb-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {clients.map((client) => (
                                <tr key={client.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 font-medium">{client.name}</td>
                                    <td className="py-4 text-slate-400 text-sm">{client.dni}</td>
                                    <td className="py-4 text-slate-400 text-sm truncate max-w-xs">{client.observations || '-'}</td>
                                    <td className="py-4 text-right">
                                        <button
                                            onClick={() => setEditingClient(client)}
                                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-xs font-bold px-3 py-1 bg-blue-500/10 rounded-md border border-blue-500/10"
                                        >
                                            <Edit2 size={12} /> Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {clients.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-slate-500 italic">
                                        No hay clientes registrados todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <EditClientModal
                isOpen={!!editingClient}
                onClose={() => setEditingClient(null)}
                client={editingClient}
            />
        </div>
    )
}
