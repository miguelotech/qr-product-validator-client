"use client"

import type { Product } from "@/lib/api"
import { imageUtils } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Package } from "lucide-react"
import Link from "next/link"

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-muted overflow-hidden">
        {product.image ? (
          <img src={imageUtils.getProductImageUrl(product)} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground">RS: {product.registroSanitario}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(product)} className="flex-1">
            <Edit2 className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(product.id)} className="flex-1">
            <Trash2 className="w-4 h-4 mr-1" />
            Eliminar
          </Button>
        </div>
        <Link href={`/products/${product.id}/batches`}>
          <Button variant="default" size="sm" className="w-full">
            Ver Maquillas
          </Button>
        </Link>
      </div>
    </Card>
  )
}
