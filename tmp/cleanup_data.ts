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
    console.log('--- INICIANDO LIMPIEZA DE DATOS ---')

    // 1. Eliminar alquileres de prueba (identificables por venue o IDs específicos)
    // Alquileres de Alberto y los que dicen STRESS TEST
    const testRentals = [
        'cmmfd7ktx000204l5j6915guf',
        'cmmfdcdus000004l4h53x9lpn',
        'cmmgb2824000004jpgxy9juzn',
        'cmmgb32y4001c04jpgunbg6jq'
    ]

    console.log('Eliminando alquileres e items asociados...')

    // Borrar items primero (si no hay cascade, though usually good to be explicit)
    await prisma.rentalItem.deleteMany({
        where: { rentalId: { in: testRentals } }
    })

    await prisma.rental.deleteMany({
        where: { id: { in: testRentals } }
    })

    // 2. Eliminar cliente de prueba (Alberto Gutierrez)
    console.log('Eliminando cliente Alberto Gutierrez...')
    await prisma.client.deleteMany({
        where: { name: 'Alberto Gutierrez' }
    })

    // 3. Eliminar productos de prueba (creados hoy con IDs cmmf... o cmmfd...)
    // Nota: "Mesa redonda" original empieza por cmmdw. Los nuevos por cmmf.
    console.log('Eliminando productos de prueba...')
    const testProducts = [
        'cmmfcouit000004l5g3n59y39',
        'cmmfdgoj9000004l7kz3iol98',
        'cmmfdh5gr000104l76ygu5psh',
        'cmmfdhjbw000004jl0qm0loiz',
        'cmmfdhzmp000204l7pw8n99ah',
        'cmmfdiazy000004l1ncbou9j3',
        'cmmfdios2000004jvqo63shup',
        'cmmfdizo6000104jv6q9h33bc',
        'cmmfdjafv000004k1ugj7bqpo'
    ]

    await prisma.product.deleteMany({
        where: { id: { in: testProducts } }
    })

    console.log('--- LIMPIEZA COMPLETADA CON ÉXITO ---')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
