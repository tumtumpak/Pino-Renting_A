'use client'

import { useState } from 'react'
import { Package, Plus, Edit2 } from 'lucide-react'
import Link from 'next/link'
import EditProductModal from '@/components/EditProductModal'

export default function ProductListPage({ products }: { products: any[] }) {
    const [editingProduct, setEditingProduct] = useState<any>(null)

    return (
        <div className="min-h-screen p-8 bg-[#0a0a0c] text-white">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Inventario de Material</h1>
                    <p className="text-slate-400">Total: {products.length} productos en catálogo</p>
                </div>
                <Link href="/" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors text-sm">
                    Volver al Dashboard
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="glass p-6 hover-scale border-white/10 relative group">
                        <button
                            onClick={() => setEditingProduct(product)}
                            className="absolute top-4 right-4 p-2 bg-white/5 opacity-0 group-hover:opacity-100 rounded-full border border-white/10 text-blue-400 hover:text-blue-300 transition-all z-10"
                        >
                            <Edit2 size={16} />
                        </button>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                                <Package className="text-emerald-400" size={24} />
                            </div>
                            <span className="text-2xl font-bold text-emerald-400">{product.pricePerUnit}€</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                        <div className="flex justify-between items-center text-sm text-slate-400">
                            <span>Stock Total:</span>
                            <span className="font-bold text-white">{product.totalStock}</span>
                        </div>
                    </div>
                ))}
                {products.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 italic glass border-dashed">
                        No hay productos en el inventario. Añade uno desde el Dashboard.
                    </div>
                )}
            </div>

            <EditProductModal
                isOpen={!!editingProduct}
                onClose={() => setEditingProduct(null)}
                product={editingProduct}
            />
        </div>
    )
}
