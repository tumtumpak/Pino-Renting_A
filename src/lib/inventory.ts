import { prisma } from './db';

/**
 * Calcula el stock disponible de un producto para un rango de fechas específico.
 * Resta las cantidades de los alquileres que se solapan con el periodo solicitado.
 */
export async function getAvailableStock(
    productId: string,
    startDate: Date,
    endDate: Date
): Promise<number> {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { totalStock: true },
    });

    if (!product) return 0;

    // Buscar alquileres que se solapan:
    // (StartA <= EndB) AND (EndA >= StartB)
    const overlappingRentals = await prisma.rentalItem.findMany({
        where: {
            productId,
            rental: {
                status: { in: ['PENDING', 'DELIVERED'] },
                AND: [
                    { startDate: { lte: endDate } },
                    { endDate: { gte: startDate } },
                ],
            },
        },
        select: {
            quantity: true,
        },
    });

    const rentedQuantity = overlappingRentals.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
    const available = product.totalStock - rentedQuantity;

    return Math.max(0, available);
}

/**
 * Valida si hay stock suficiente para una lista de productos en un periodo dado.
 */
export async function validateRentalStock(
    items: { productId: string; quantity: number }[],
    startDate: Date,
    endDate: Date
): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    for (const item of items) {
        const available = await getAvailableStock(item.productId, startDate, endDate);
        if (available < item.quantity) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            errors.push(
                `Stock insuficiente para ${product?.name || 'Producto desconocido'}. Disponible: ${available}, Solicitado: ${item.quantity}`
            );
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
