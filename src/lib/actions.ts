'use server'

import { prisma } from './db'
import { revalidatePath } from 'next/cache'
import { validateRentalStock } from './inventory'

// --- CLIENT ACTIONS ---

export async function createClient(formData: FormData) {
    const name = formData.get('name') as string
    const dni = formData.get('dni') as string
    const observations = formData.get('observations') as string

    await prisma.client.create({
        data: { name, dni, observations }
    })

    revalidatePath('/')
    revalidatePath('/clients')
}

export async function updateClient(id: string, data: { name?: string; dni?: string; observations?: string }) {
    await prisma.client.update({
        where: { id },
        data
    })
    revalidatePath('/')
    revalidatePath('/clients')
}

export async function deleteClient(id: string) {
    await prisma.client.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/clients')
}

// --- PRODUCT ACTIONS ---

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string
    const totalStock = parseInt(formData.get('totalStock') as string)
    const pricePerUnit = parseFloat(formData.get('pricePerUnit') as string)

    await prisma.product.create({
        data: { name, totalStock, pricePerUnit }
    })

    revalidatePath('/')
    revalidatePath('/products')
}

export async function updateProduct(id: string, data: { name?: string; totalStock?: number; pricePerUnit?: number }) {
    await prisma.product.update({
        where: { id },
        data
    })
    revalidatePath('/')
    revalidatePath('/products')
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/products')
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
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)

    try {
        // 1. Validar stock dinámico
        const validation = await validateRentalStock(data.items, start, end)
        if (!validation.valid) {
            return { error: validation.errors.join(', ') }
        }

        // 2. Calcular precio total
        let total = 0
        for (const item of data.items) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } })
            total += (product?.pricePerUnit || 0) * item.quantity
        }

        // 3. Crear alquiler y sus items
        await prisma.rental.create({
            data: {
                clientId: data.clientId,
                startDate: start,
                endDate: end,
                venue: data.venue,
                observations: data.observations,
                totalPrice: total,
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
        console.error('Error creating rental:', error)
        return { error: error.message || 'Error de conexión con la base de datos' }
    }
}

export async function updateRentalStatus(id: string, status: 'PENDING' | 'DELIVERED' | 'RETURNED' | 'CANCELLED') {
    await prisma.rental.update({
        where: { id },
        data: { status }
    })
    revalidatePath('/')
}

export async function markAsPaid(id: string) {
    await prisma.rental.update({
        where: { id },
        data: { paymentStatus: true }
    })
    revalidatePath('/')
}
