"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { BatchForm } from "@/components/batch-form"
import { BatchCard } from "@/components/batch-card"
import { Button } from "@/components/ui/button"
import { productsApi, batchesApi, type Product, type ProductBatch } from "@/lib/api"
import type { BatchFormData } from "@/lib/validation"
import { Plus, AlertCircle, Loader, ArrowLeft } from "lucide-react"

export default function BatchesPage() {
  const params = useParams()
  const router = useRouter()
  const productId = Number.parseInt(params.productId as string)

  const [product, setProduct] = useState<Product | null>(null)
  const [batches, setBatches] = useState<ProductBatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [showForm, setShowForm] = useState(false)
  const [editingBatch, setEditingBatch] = useState<ProductBatch | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [productId])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [productData, batchesData] = await Promise.all([
        productsApi.getById(productId),
        batchesApi.getByProduct(productId),
      ])
      setProduct(productData)
      setBatches(batchesData)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (data: BatchFormData) => {
    try {
      setIsSubmitting(true)
      if (editingBatch) {
        await batchesApi.update(productId, editingBatch.id, data)
      } else {
        await batchesApi.create(productId, data)
      }
      await loadData()
      setShowForm(false)
      setEditingBatch(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar lote")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (batch: ProductBatch) => {
    setEditingBatch(batch)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este lote?")) return
    try {
      await batchesApi.delete(productId, id)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar lote")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.push("/products")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Productos
        </Button>

        {product && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              {product.image && (
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-muted-foreground mt-1">Registro Sanitario: {product.registroSanitario}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Lotes</h2>
            <p className="text-muted-foreground mt-1">Gestiona los lotes de este producto</p>
          </div>
          <Button
            onClick={() => {
              setEditingBatch(null)
              setShowForm(!showForm)
            }}
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Lote
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
            <BatchForm
              batch={
                editingBatch
                  ? {
                      numeroMaquilla: editingBatch.numeroMaquilla,
                      variedadArroz: editingBatch.variedadArroz,
                      fechaProduccion: editingBatch.fechaProduccion,
                      fechaVencimiento: editingBatch.fechaVencimiento,
                    }
                  : undefined
              }
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </div>
        )}

        {batches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No hay lotes aún</p>
            <p className="text-muted-foreground text-sm">Crea tu primer lote para comenzar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {batches.map((batch) => (
              <BatchCard key={batch.id} batch={batch} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
