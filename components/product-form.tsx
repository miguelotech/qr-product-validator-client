"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productFormSchema, type ProductFormData } from "@/lib/validation"
import type { Product } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle, Upload } from "lucide-react"

interface ProductFormProps {
  product?: Product
  onSubmit: (data: ProductFormData, image?: File) => Promise<void>
  isLoading?: boolean
}

export function ProductForm({ product, onSubmit, isLoading }: ProductFormProps) {
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(product?.image || "")
  const [error, setError] = useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      registroSanitario: product?.registroSanitario || "",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        setError("Solo se permiten imágenes JPG, PNG, GIF o WebP")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no debe exceder 5MB")
        return
      }
      setError("")
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      await onSubmit(data, image || undefined)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el producto")
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Nombre</label>
          <Input
            {...register("name")}
            placeholder="Ej: Arroz Integral Premium"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-destructive text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Registro Sanitario</label>
          <Input
            {...register("registroSanitario")}
            placeholder="Ej: RS-2024-001"
            className={errors.registroSanitario ? "border-destructive" : ""}
          />
          {errors.registroSanitario && (
            <p className="text-destructive text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.registroSanitario.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Añade Imagen</label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-input" />
            <label htmlFor="image-input" className="cursor-pointer">
              {imagePreview ? (
                <div className="space-y-2">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-32 h-32 object-cover mx-auto rounded"
                  />
                  <p className="text-sm text-muted-foreground">Haz clic para cambiar</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">Arrastra una imagen o haz clic</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, GIF o WebP (máx 5MB)</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Guardando..." : product ? "Actualizar Variedad" : "Crear Variedad"}
        </Button>
      </form>
    </Card>
  )
}
