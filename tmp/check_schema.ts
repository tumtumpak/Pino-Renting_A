import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

async function checkSchema() {
    console.log('--- VERIFICANDO ESQUEMA SQL ---')
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    })

    try {
        const client = await pool.connect()
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'Rental';
        `)
        console.log('Columnas en la tabla Rental:')
        res.rows.forEach(col => console.log(`- ${col.column_name} (${col.data_type})`))
        client.release()
    } catch (err) {
        console.error('ERROR SQL:', err)
    } finally {
        await pool.end()
    }
}

checkSchema()
