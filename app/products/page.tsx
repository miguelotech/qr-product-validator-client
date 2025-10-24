"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { ProductForm } from "@/components/product-form"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { productsApi, type Product } from "@/lib/api"
import type { ProductFormData } from "@/lib/validation"
import { Plus, AlertCircle, Loader } from "lucide-react"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      const data = await productsApi.getAll()
      console.debug("[ProductsPage] loaded products:", data)
      console.debug(
        "[ProductsPage] product image fields:",
        data.map((p: Product) => ({ id: p.id, image: p.image }))
      )
      setProducts(data)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar productos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (data: ProductFormData, image?: File) => {
    try {
      setIsSubmitting(true)
      if (editingProduct) {
        // If no new image file was provided, include the existing image path
        // so the backend won't clear it when updating.
        const payload = image ? data : { ...data, image: editingProduct.image }
        await productsApi.update(editingProduct.id, payload, image)
      } else {
        await productsApi.create(data, image)
      }
      await loadProducts()
      setShowForm(false)
      setEditingProduct(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar producto")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return
    try {
      await productsApi.delete(id)
      await loadProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar producto")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold"> Catálogo</h1>
            <p className="text-muted-foreground mt-1">Elige la variedad de arroz</p>
          </div>
          <Button
            onClick={() => {
              setEditingProduct(null)
              setShowForm(!showForm)
            }}
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Añadir
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-8">
            <ProductForm product={editingProduct || undefined} onSubmit={handleSubmit} isLoading={isSubmitting} />
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No hay variedad de arroz creados aún.</p>
            <p className="text-muted-foreground text-sm">Añade el primero para comenzar...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
