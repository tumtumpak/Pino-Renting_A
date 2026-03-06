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
    rentals = JSON.parse(JSON.stringify(rentalsList))
    allClients = JSON.parse(JSON.stringify(clientsList))
    allProducts = JSON.parse(JSON.stringify(productsList))
  } catch (error) {
    console.error('Prisma failed during build/render:', error)
  }

  return <HomePage stats={stats} recentRentals={rentals} allClients={allClients} allProducts={allProducts} />
}
