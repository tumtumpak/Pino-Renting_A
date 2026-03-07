import { prisma } from '@/lib/db'
import ProductListPage from './ProductListPage'

export const dynamic = 'force-dynamic'

export default async function Page() {
    const productsRaw = await prisma.product.findMany({
        orderBy: { name: 'asc' }
    })
    const products = JSON.parse(JSON.stringify(productsRaw))

    return <ProductListPage products={products} />
}
