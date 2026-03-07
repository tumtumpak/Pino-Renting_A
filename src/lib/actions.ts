'use server'

import { prisma } from './db'
import { revalidatePath } from 'next/cache'
import { validateRentalStock } from './inventory'

// --- CLIENT ACTIONS ---

export async function createClient(formData: FormData) {
    try {
        const name = formData.get('name') as string
        const dni = formData.get('dni') as string
        const observations = formData.get('observations') as string

        if (!name || !dni) return { error: 'Nombre y DNI son obligatorios.' }

        await prisma.client.create({
            data: { name, dni, observations }
        })

        revalidatePath('/')
        revalidatePath('/clients')
        return { success: true }
    } catch (error: any) {
        console.error('SERVER ACTION ERROR (createClient):', error)
        if (error.code === 'P2002') return { error: 'Ya existe un cliente con ese DNI.' }
        return { error: 'Error al conectar con la base de datos o datos inválidos.' }
    }
}

export async function updateClient(id: string, data: { name?: string; dni?: string; observations?: string }) {
    try {
        await prisma.client.update({
            where: { id },
            data
        })
        revalidatePath('/')
        revalidatePath('/clients')
        return { success: true }
    } catch (error) {
        return { error: 'No se pudo actualizar el cliente.' }
    }
}

export async function deleteClient(id: string) {
    try {
        await prisma.client.delete({ where: { id } })
        revalidatePath('/')
        revalidatePath('/clients')
        return { success: true }
    } catch (error) {
        return { error: 'No se pudo eliminar el cliente. Asegúrate de que no tenga alquileres asociados.' }
    }
}

// --- PRODUCT ACTIONS ---

export async function createProduct(formData: FormData) {
    try {
        const name = formData.get('name') as string
        const totalStock = parseInt(formData.get('totalStock') as string)
        const pricePerUnit = parseFloat(formData.get('pricePerUnit') as string)

        if (!name || isNaN(totalStock)) return { error: 'Nombre y Stock son obligatorios.' }

        await prisma.product.create({
            data: { name, totalStock, pricePerUnit }
        })

        revalidatePath('/')
        revalidatePath('/products')
        return { success: true }
    } catch (error: any) {
        console.error('SERVER ACTION ERROR (createProduct):', error)
        return { error: 'Error al crear el producto. Revisa los datos.' }
    }
}

export async function updateProduct(id: string, data: { name?: string; totalStock?: number; pricePerUnit?: number }) {
    try {
        await prisma.product.update({
            where: { id },
            data
        })
        revalidatePath('/')
        revalidatePath('/products')
        return { success: true }
    } catch (error) {
        return { error: 'No se pudo actualizar el producto.' }
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({ where: { id } })
        revalidatePath('/')
        revalidatePath('/products')
        return { success: true }
    } catch (error) {
        return { error: 'No se pudo eliminar el producto.' }
    }
}

// --- RENTAL ACTIONS ---

export async function createRental(data: {
    clientId: string
    startDate: string
    endDate: string
    venue: string
    items: { productId: string; quantity: number }[]
    observations?: string
}) {
    try {
        if (!data.clientId || !data.startDate || !data.endDate || data.items.length === 0) {
            return { error: 'Faltan datos obligatorios para crear el alquiler.' }
        }

        const start = new Date(data.startDate)
        const end = new Date(data.endDate)

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return { error: 'Las fechas seleccionadas no son válidas.' }
        }

        if (start >= end) {
            return { error: 'La fecha de inicio debe ser anterior a la fecha de fin.' }
        }

        // 1. Validar stock dinámico
        const validation = await validateRentalStock(data.items, start, end)
        if (!validation.valid) {
            return { error: validation.errors.join(', ') }
        }

        // 2. Calcular precio total y validar límites
        let total = 0
        const MAX_SAFE_VALUE = 999999999

        for (const item of data.items) {
            if (!item.productId) return { error: 'Uno de los productos no es válido.' }
            if (item.quantity <= 0 || item.quantity > 1000000) return { error: 'Cantidad de producto no válida o demasiado alta.' }

            const product = await prisma.product.findUnique({ where: { id: item.productId } })
            if (!product) return { error: `Producto no encontrado: ${item.productId}` }

            total += (product.pricePerUnit || 0) * item.quantity
        }

        if (total > MAX_SAFE_VALUE) return { error: 'El precio total es demasiado alto para procesarlo.' }

        // 3. Crear alquiler y sus items
        await prisma.rental.create({
            data: {
                clientId: data.clientId,
                startDate: start,
                endDate: end,
                venue: data.venue || '',
                observations: data.observations || '',
                totalPrice: total,
                status: 'PENDING',
                items: {
                    create: data.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity
                    }))
                }
            }
        })

        revalidatePath('/')
        revalidatePath('/rentals')
        return { success: true }
    } catch (error: any) {
        console.error('SERVER ACTION ERROR (createRental):', error)
        return { error: 'Error interno del servidor. Comprueba la conexión o que los datos no sean extremos.' }
    }
}

export async function updateRentalStatus(id: string, status: 'PENDING' | 'DELIVERED' | 'RETURNED' | 'CANCELLED') {
    const data: any = { status }

    // Si pasa a ENTREGADO y no tiene albarán, generamos uno
    if (status === 'DELIVERED') {
        const rental = await prisma.rental.findUnique({ where: { id } })
        if (rental && !rental.deliveryNoteNumber) {
            const year = new Date().getFullYear()
            const count = await prisma.rental.count({
                where: { deliveryNoteNumber: { startsWith: `ALB-${year}` } }
            })
            data.deliveryNoteNumber = `ALB-${year}-${(count + 1).toString().padStart(3, '0')}`
        }
    }

    await prisma.rental.update({
        where: { id },
        data
    })
    revalidatePath('/')
}

export async function markAsPaid(id: string) {
    const rental = await prisma.rental.findUnique({ where: { id } })
    const data: any = { paymentStatus: true }

    // Si se marca como pagado y no tiene factura, generamos una
    if (rental && !rental.invoiceNumber) {
        const year = new Date().getFullYear()
        const count = await prisma.rental.count({
            where: { invoiceNumber: { startsWith: `FAC-${year}` } }
        })
        data.invoiceNumber = `FAC-${year}-${(count + 1).toString().padStart(3, '0')}`
        data.invoiceDate = new Date()
    }

    await prisma.rental.update({
        where: { id },
        data
    })
    revalidatePath('/')
}
