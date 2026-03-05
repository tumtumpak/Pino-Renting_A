import { prisma } from '@/lib/db'
import { Plus, Users, Search } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
    const clients = await prisma.client.findMany({
        orderBy: { name: 'asc' }
    })

    return (
        <div className="min-h-screen p-8 bg-[#0a0a0c] text-white">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Gestión de Clientes</h1>
                    <p className="text-slate-400">Total: {clients.length} clientes registrados</p>
                </div>
                <Link href="/" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
                    Volver al Dashboard
                </Link>
            </header>

            <div className="glass p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400">
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
                                    <td className="py-4 text-slate-400">{client.dni}</td>
                                    <td className="py-4 text-slate-400 truncate max-w-xs">{client.observations || '-'}</td>
                                    <td className="py-4 text-right">
                                        <button className="text-blue-400 hover:text-blue-300 transition-colors">Ver Detalles</button>
                                    </td>
                                </tr>
                            ))}
                            {clients.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-slate-500 italic">
                                        No hay clientes registrados todavía.
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
