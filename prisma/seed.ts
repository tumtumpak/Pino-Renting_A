import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const url = process.env.DIRECT_URL || process.env.DATABASE_URL
console.log('Conectando a:', url?.split('@')[1]) // Solo mostrar el host

const pool = new pg.Pool({
  connectionString: url,
  ssl: { rejectUnauthorized: false }
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('--- Iniciando Seed de Datos Realistas ---')

  // 1. Limpiar datos existentes (opcional, pero recomendado para demo limpia)
  await prisma.rentalItem.deleteMany({})
  await prisma.payment.deleteMany({})
  await prisma.rental.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.client.deleteMany({})

  // 2. Crear Clientes (Sevilla/Andalucía)
  const clients = await Promise.all([
    prisma.client.create({ data: { name: 'Hotel Alfonso XIII', dni: 'B41000001', observations: 'Cliente VIP' } }),
    prisma.client.create({ data: { name: 'Hacienda Guzmán', dni: 'B41000002', observations: 'Eventos tipo boda' } }),
    prisma.client.create({ data: { name: 'Restaurante Abades Triana', dni: 'B41000003' } }),
    prisma.client.create({ data: { name: 'Palacio de las Dueñas', dni: 'B41000004' } }),
    prisma.client.create({ data: { name: 'Catering Miguel Ángel', dni: 'B41000005' } }),
    prisma.client.create({ data: { name: 'Evento Particular - Carmen R.', dni: '12345678X' } }),
  ])

  // 3. Crear Productos (Material de Hostelería)
  const products = await Promise.all([
    prisma.product.create({ data: { name: 'Silla Tiffany Blanca', totalStock: 500, pricePerUnit: 4.5 } }),
    prisma.product.create({ data: { name: 'Mesa Redonda 1.8m', totalStock: 100, pricePerUnit: 15.0 } }),
    prisma.product.create({ data: { name: 'Mantelería Lino Beige', totalStock: 150, pricePerUnit: 8.0 } }),
    prisma.product.create({ data: { name: 'Copa de Vino Cristal Fino', totalStock: 1000, pricePerUnit: 0.8 } }),
    prisma.product.create({ data: { name: 'Plato Presentación Dorado', totalStock: 800, pricePerUnit: 1.2 } }),
    prisma.product.create({ data: { name: 'Mesa Imperial Madera', totalStock: 20, pricePerUnit: 45.0 } }),
  ])

  // 4. Crear Alquileres Históricos (Últimos 6 meses)
  const now = new Date()
  const statuses = ['PENDING', 'DELIVERED', 'RETURNED', 'RETURNED', 'RETURNED'] // Más devueltos en el pasado
  
  for (let i = 0; i < 30; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)]
    // Fecha aleatoria en los últimos 180 días
    const startDate = new Date()
    startDate.setDate(now.getDate() - Math.floor(Math.random() * 180))
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 3)

    const status = startDate < now ? (Math.random() > 0.8 ? 'DELIVERED' : 'RETURNED') : 'PENDING'
    const isPaid = Math.random() > 0.3

    // Items aleatorios
    const numItems = Math.floor(Math.random() * 3) + 1
    const rentalItems = []
    let total = 0

    for (let j = 0; j < numItems; j++) {
      const prod = products[Math.floor(Math.random() * products.length)]
      const qty = Math.floor(Math.random() * 50) + 10
      rentalItems.push({ productId: prod.id, quantity: qty })
      total += qty * (prod.pricePerUnit || 0)
    }

    await prisma.rental.create({
      data: {
        clientId: client.id,
        startDate,
        endDate,
        venue: 'Sevilla - Sede Cliente',
        status: status as any,
        paymentStatus: isPaid,
        totalPrice: parseFloat(total.toFixed(2)),
        items: {
          create: rentalItems
        }
      }
    })
  }

  console.log('--- Seed completada con éxito: 6 Clientes, 6 Productos y 30 Alquileres ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
