import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const prismaClientSingleton = () => {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
}

const prisma = prismaClientSingleton()

async function main() {
    console.log('--- BUSCANDO DATOS DE PRUEBA ---')

    // Alquileres de prueba suelen tener fechas en 2026 o venues específicos
    const rentals = await prisma.rental.findMany({
        include: { client: true }
    })
    console.log('\nALQUILERES:')
    rentals.forEach(r => {
        console.log(`- ID: ${r.id} | Cliente: ${r.client.name} | Lugar: ${r.venue} | Notas: ${r.observations?.substring(0, 30)}...`)
    })

    // Clientes creados en tests
    const clients = await prisma.client.findMany()
    console.log('\nCLIENTES:')
    clients.forEach(c => {
        console.log(`- ID: ${c.id} | Nombre: ${c.name} | DNI: ${c.dni}`)
    })

    // Productos creados en tests (si hay nuevos)
    const products = await prisma.product.findMany()
    console.log('\nPRODUCTOS:')
    products.forEach(p => {
        console.log(`- ID: ${p.id} | Nombre: ${p.name}`)
    })
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
