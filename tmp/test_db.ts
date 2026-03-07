import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

async function testConnection() {
    console.log('--- TEST DE CONEXIÓN ---')
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000
    })

    try {
        console.log('Intentando conectar al pool...')
        const client = await pool.connect()
        console.log('Conexión exitosa a PostgreSQL.')

        const res = await client.query('SELECT current_database(), now();')
        console.log('Respuesta DB:', res.rows[0])

        client.release()

        const prisma = new PrismaClient({
            adapter: new PrismaPg(pool)
        })

        console.log('Probando Prisma...')
        const clientCount = await prisma.client.count()
        console.log('Total clientes en BD:', clientCount)

        await prisma.$disconnect()
    } catch (err) {
        console.error('ERROR DE CONEXIÓN:', err)
    } finally {
        await pool.end()
    }
}

testConnection()
