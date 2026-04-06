'use client'

import { useState } from 'react'
import Dashboard from '../components/Dashboard'
import NewClientModal from '../components/NewClientModal'
import NewProductModal from '../components/NewProductModal'
import NewRentalModal from '../components/NewRentalModal'

export default function HomePage({
    stats,
    recentRentals,
    allClients,
    allProducts,
    chartData,
    topProducts
}: {
    stats: {
        activeRentals: number
        totalProducts: number
        totalClients: number
        pendingPayments: number
    },
    recentRentals: any[],
    allClients: any[],
    allProducts: any[],
    chartData: any[],
    topProducts: any[]
}) {
    const [modalOpen, setModalOpen] = useState<'client' | 'product' | 'rental' | null>(null)

    return (
        <>
            <Dashboard
                stats={stats}
                recentRentals={recentRentals}
                chartData={chartData}
                topProducts={topProducts}
                onAction={(action: 'client' | 'product' | 'rental') => setModalOpen(action)}
            />

            <NewClientModal
                isOpen={modalOpen === 'client'}
                onClose={() => setModalOpen(null)}
            />

            <NewProductModal
                isOpen={modalOpen === 'product'}
                onClose={() => setModalOpen(null)}
            />

            <NewRentalModal
                isOpen={modalOpen === 'rental'}
                onClose={() => setModalOpen(null)}
                clients={allClients}
                products={allProducts}
            />
        </>
    )
}
