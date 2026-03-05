import { prisma } from '@/lib/db'
import HomePage from './ClientHome'

export default async function Page() {
  // Obtener datos reales de la BD
  const [activeRentalsCount, totalProducts, totalClients, rentals] = await Promise.all([
    prisma.rental.count({ where: { status: { in: ['PENDING', 'DELIVERED'] } } }),
    prisma.product.count(),
    prisma.client.count(),
    prisma.rental.findMany({
      take: 5,
      orderBy: { startDate: 'asc' },
      include: { client: true }
    })
  ])

  // Calcular pagos pendientes
  const pendingRentals = await prisma.rental.findMany({
    where: { paymentStatus: false },
    select: { totalPrice: true }
  })
  const pendingTotal = pendingRentals.reduce((sum, r) => sum + r.totalPrice, 0)

  const stats = {
    activeRentals: activeRentalsCount,
    totalProducts,
    totalClients,
    pendingPayments: pendingTotal
  }

  return <HomePage stats={stats} recentRentals={rentals} />
}
