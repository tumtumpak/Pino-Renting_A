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

    let chartData: any[] = []
    let topProducts: any[] = []

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

      // --- Datos para Gráficos (Dashboard Analytics) ---
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const [recentHistory, topProductsRaw] = await Promise.all([
        prisma.rental.findMany({
          where: { startDate: { gte: sixMonthsAgo } },
          select: { startDate: true, totalPrice: true },
          orderBy: { startDate: 'asc' }
        }),
        prisma.rentalItem.groupBy({
          by: ['productId'],
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 5
        })
      ])

      // Procesar meses
      const monthsMap: Record<string, { month: string, revenue: number, count: number }> = {}
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

      for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const key = `${d.getFullYear()}-${d.getMonth()}`
        monthsMap[key] = { month: `${monthNames[d.getMonth()]}`, revenue: 0, count: 0 }
      }

      recentHistory.forEach(r => {
        const key = `${r.startDate.getFullYear()}-${r.startDate.getMonth()}`
        if (monthsMap[key]) {
          monthsMap[key].revenue += r.totalPrice
          monthsMap[key].count += 1
        }
      })

      chartData = Object.values(monthsMap)

      // Detallar Top 5 Productos
      topProducts = await Promise.all(topProductsRaw.map(async (item) => {
        const product = await prisma.product.findUnique({ where: { id: item.productId }, select: { name: true } })
        return {
          name: product?.name || 'Desconocido',
          value: item._sum.quantity || 0
        }
      }))

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

    return <HomePage 
        stats={stats} 
        recentRentals={rentals} 
        allClients={allClients} 
        allProducts={allProducts} 
        chartData={JSON.parse(JSON.stringify(chartData))}
        topProducts={JSON.parse(JSON.stringify(topProducts))}
    />
}
