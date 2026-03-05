import { prisma } from '@/lib/db'
import ClientListPage from './ClientListPage'

export const dynamic = 'force-dynamic'

export default async function Page() {
    const clients = await prisma.client.findMany({
        orderBy: { name: 'asc' }
    })

    return <ClientListPage clients={clients} />
}
