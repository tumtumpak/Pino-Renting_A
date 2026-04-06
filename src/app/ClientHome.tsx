'use client'

import { useState, useTransition } from 'react'
import Dashboard from '../components/Dashboard'
import NewClientModal from '../components/NewClientModal'
import NewProductModal from '../components/NewProductModal'
import NewRentalModal from '../components/NewRentalModal'
import { seedDemoData } from '@/lib/seed-action'

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
    const [isPending, startTransition] = useTransition()

    const handleAction = (action: 'client' | 'product' | 'rental' | 'seed') => {
        if (action === 'seed') {
            if (confirm('¿Estás seguro? Esto borrará todos los datos actuales y cargará la demo del TFG.')) {
                startTransition(async () => {
                    const result = await seedDemoData()
                    if (result.success) {
                        alert('Demo cargada correctamente. La página se actualizará.')
                    } else {
                        alert('Error al cargar la demo: ' + result.error)
                    }
                })
            }
        } else {
            setModalOpen(action)
        }
    }

    return (
        <>
            <Dashboard
                stats={stats}
                recentRentals={recentRentals}
                chartData={chartData}
                topProducts={topProducts}
                onAction={handleAction}
                isSeeding={isPending}
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
