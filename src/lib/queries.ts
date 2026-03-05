'use server'

import { prisma } from './db'

export async function getRentalsWithItems() {
    return await prisma.rental.findMany({
        orderBy: { startDate: 'desc' },
        include: {
            client: true,
            items: {
                include: {
                    product: true
                }
            }
        }
    })
}
