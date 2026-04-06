'use server'

import { prisma } from './db'
import { revalidatePath } from 'next/cache'

export async function seedDemoData() {
  try {
    console.log('--- Iniciando Seed de Datos Corporativos (Server Side) ---')

    // 1. Limpieza segura (solo para demostración)
    await prisma.rentalItem.deleteMany({})
    await prisma.payment.deleteMany({})
    await prisma.rental.deleteMany({})
    await prisma.product.deleteMany({})
    await prisma.client.deleteMany({})

    // 2. Clientes Seleccionados (Sevilla/Andalucía)
    const clients = await Promise.all([
      prisma.client.create({ data: { name: 'Hotel Alfonso XIII', dni: 'B41000001', observations: 'Cliente VIP - Cuentas corporativas' } }),
      prisma.client.create({ data: { name: 'Restaurante Abades Triana', dni: 'B41000003', observations: 'Eventos recurrentes' } }),
      prisma.client.create({ data: { name: 'Hacienda Guzmán', dni: 'B41000002', observations: 'Especialistas en bodas' } }),
      prisma.client.create({ data: { name: 'Catering Miguel Ángel', dni: 'B41000005' } }),
      prisma.client.create({ data: { name: 'Fundación Cajasol', dni: 'G41000999' } }),
    ])

    // 3. Catálogo de Hostelería de Diseño
    const products = await Promise.all([
      prisma.product.create({ data: { name: 'Silla Tiffany Blanca', totalStock: 500, pricePerUnit: 5.5 } }),
      prisma.product.create({ data: { name: 'Mesa Redonda 1.8m (12 pax)', totalStock: 80, pricePerUnit: 18.0 } }),
      prisma.product.create({ data: { name: 'Mantelería Lino Premium', totalStock: 120, pricePerUnit: 12.0 } }),
      prisma.product.create({ data: { name: 'Cristalería Bohemia (Set 10)', totalStock: 200, pricePerUnit: 15.0 } }),
      prisma.product.create({ data: { name: 'Vajilla Porcelana Bone China', totalStock: 600, pricePerUnit: 2.5 } }),
      prisma.product.create({ data: { name: 'Mesa Imperial Madera Roble', totalStock: 15, pricePerUnit: 55.0 } }),
    ])

    // 4. Generación de Histórico Realista (6 meses)
    const now = new Date()
    
    for (let i = 0; i < 25; i++) {
      const client = clients[Math.floor(Math.random() * clients.length)]
      
      // Fecha aleatoria en los últimos 180 días
      const startDate = new Date()
      startDate.setDate(now.getDate() - Math.floor(Math.random() * 180))
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 2)

      // Diferentes estados según la fecha
      let status: 'PENDING' | 'DELIVERED' | 'RETURNED' = 'RETURNED'
      if (startDate > now) status = 'PENDING'
      else if (Math.random() > 0.8) status = 'DELIVERED'

      const isPaid = Math.random() > 0.3

      // Items aleatorios por pedido
      const numItems = Math.floor(Math.random() * 2) + 1
      const rentalItems = []
      let total = 0

      for (let j = 0; j < numItems; j++) {
        const prod = products[Math.floor(Math.random() * products.length)]
        const qty = Math.floor(Math.random() * 40) + 10
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

    revalidatePath('/')
    return { success: true, message: 'Base de datos poblada con éxito' }
  } catch (error) {
    console.error('Error en Seeding:', error)
    return { success: false, error: 'Error al generar los datos' }
  }
}
