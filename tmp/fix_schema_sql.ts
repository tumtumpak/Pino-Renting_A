import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

async function fixSchema() {
    console.log('--- APLICANDO PARCHE DE ESQUEMA SQL ---')
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    })

    try {
        const client = await pool.connect()

        console.log('Añadiendo columnas a Rental...')
        await client.query(`
            ALTER TABLE "Rental" 
            ADD COLUMN IF NOT EXISTS "invoiceNumber" TEXT,
            ADD COLUMN IF NOT EXISTS "deliveryNoteNumber" TEXT,
            ADD COLUMN IF NOT EXISTS "invoiceDate" TIMESTAMP WITH TIME ZONE;
        `)

        console.log('Creando índices únicos...')
        // Usamos DO para evitar errores si ya existen los índices
        await client.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'Rental_invoiceNumber_key') THEN
                    CREATE UNIQUE INDEX "Rental_invoiceNumber_key" ON "Rental"("invoiceNumber");
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'Rental_deliveryNoteNumber_key') THEN
                    CREATE UNIQUE INDEX "Rental_deliveryNoteNumber_key" ON "Rental"("deliveryNoteNumber");
                END IF;
            END $$;
        `)

        console.log('Esquema actualizado correctamente.')
        client.release()
    } catch (err) {
        console.error('ERROR AL APLICAR PARCHE:', err)
    } finally {
        await pool.end()
    }
}

fixSchema()
