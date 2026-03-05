import { prisma } from '@/lib/db'
import ProductListPage from './ProductListPage'

export const dynamic = 'force-dynamic'

export default async function Page() {
    const products = await prisma.product.findMany({
        orderBy: { name: 'asc' }
    })

    return <ProductListPage products={products} />
}
