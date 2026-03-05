'use client'

import { useState, useMemo } from 'react'
import Dashboard from '@/components/Dashboard'
import NewClientModal from '@/components/NewClientModal'
import NewProductModal from '@/components/NewProductModal'

export default function HomePage({
    stats,
    recentRentals
}: {
    stats: any,
    recentRentals: any[]
}) {
    const [modalOpen, setModalOpen] = useState<'client' | 'product' | 'rental' | null>(null)

    return (
        <>
            <Dashboard
                stats={stats}
                recentRentals={recentRentals}
                onAction={(action) => setModalOpen(action)}
            />

            <NewClientModal
                isOpen={modalOpen === 'client'}
                onClose={() => setModalOpen(null)}
            />

            <NewProductModal
                isOpen={modalOpen === 'product'}
                onClose={() => setModalOpen(null)}
            />

            {/* El modal de alquiler se puede implementar en una ruta separada o aquí mismo */}
        </>
    )
}
