import { prisma } from '@/lib/db'
import HomePage from './ClientHome'

export const dynamic = 'force-dynamic'

export default async function Page() {
  let stats = {
    activeRentals: 0,
    totalProducts: 0,
    totalClients: 0,
    pendingPayments: 0
  }
  let rentals: any[] = []
  let allClients: any[] = []
  let allProducts: any[] = []

  try {
    // Obtener datos reales de la BD
    const [
      activeRentalsCount,
      totalProductsCount,
      totalClientsCount,
      rentalsList,
      clientsList,
      productsList
    ] = await Promise.all([
      prisma.rental.count({ where: { status: { in: ['PENDING', 'DELIVERED'] } } }),
      prisma.product.count(),
      prisma.client.count(),
      prisma.rental.findMany({
        take: 5,
        orderBy: { startDate: 'asc' },
        include: { client: true }
      }),
      prisma.client.findMany({ orderBy: { name: 'asc' } }),
      prisma.product.findMany({ orderBy: { name: 'asc' } })
    ])

    // Calcular pagos pendientes
    const pendingRentals = await prisma.rental.findMany({
      where: { paymentStatus: false },
      select: { totalPrice: true }
    })
    const pendingTotal = pendingRentals.reduce((sum: number, r: { totalPrice: number }) => sum + r.totalPrice, 0)

    stats = {
      activeRentals: activeRentalsCount,
      totalProducts: totalProductsCount,
      totalClients: totalClientsCount,
      pendingPayments: pendingTotal
    }
    rentals = rentalsList
    allClients = clientsList
    allProducts = productsList
  } catch (error: any) {
    console.error('Prisma failed during build/render:', error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white p-8 font-mono text-xs">
        <div className="max-w-2xl bg-red-500/10 border border-red-500/20 p-6 rounded-lg">
          <h1 className="text-red-400 font-bold mb-4">CRITICAL CONNECTION ERROR</h1>
          <pre className="whitespace-pre-wrap">{error.message || 'Unknown database error'}</pre>
          <div className="mt-4 text-slate-500 italic">Check DATABASE_URL and Supabase Pooler settings.</div>
        </div>
      </div>
    )
  }

  return <HomePage stats={stats} recentRentals={rentals} allClients={allClients} allProducts={allProducts} />
}
