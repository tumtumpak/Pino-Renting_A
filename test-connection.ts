import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        await prisma.$connect()
        console.log('✅ Conexión exitosa con Supabase')
    } catch (e) {
        console.error('❌ Error de conexión:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
