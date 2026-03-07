import { prisma } from '@/lib/db'
import ClientListPage from './ClientListPage'

export const dynamic = 'force-dynamic'

export default async function Page() {
    const clientsRaw = await prisma.client.findMany({
        orderBy: { name: 'asc' }
    })
    const clients = JSON.parse(JSON.stringify(clientsRaw))

    return <ClientListPage clients={clients} />
}
