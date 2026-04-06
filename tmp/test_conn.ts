import { prisma } from '../src/lib/db'

async function test() {
    try {
        const count = await prisma.client.count()
        console.log('Conexión exitosa. Clientes:', count)
    } catch (e) {
        console.error('Fallo de conexión:', e)
    } finally {
        await prisma.$disconnect()
    }
}

test()
