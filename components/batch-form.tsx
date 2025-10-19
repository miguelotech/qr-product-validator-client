"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { batchFormSchema, type BatchFormData } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { dateUtils } from "@/lib/api"

interface BatchFormProps {
  batch?: BatchFormData
  onSubmit: (data: BatchFormData) => Promise<void>
  isLoading?: boolean
}

export function BatchForm({ batch, onSubmit, isLoading }: BatchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BatchFormData>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: batch ? {
      ...batch,
      // Ensure dates are in YYYY-MM-DD format for input fields
      fechaProduccion: batch.fechaProduccion ? dateUtils.formatDateForInput(batch.fechaProduccion) : '',
      fechaVencimiento: batch.fechaVencimiento ? dateUtils.formatDateForInput(batch.fechaVencimiento) : '',
    } : {},
  })

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Número de Maquilla</label>
          <Input
            {...register("numeroMaquilla")}
            placeholder="Ej: MAQ-2024-001"
            className={errors.numeroMaquilla ? "border-destructive" : ""}
          />
          {errors.numeroMaquilla && (
            <p className="text-destructive text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.numeroMaquilla.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Variedad de Arroz</label>
          <Input
            {...register("variedadArroz")}
            placeholder="Ej: Integral Premium"
            className={errors.variedadArroz ? "border-destructive" : ""}
          />
          {errors.variedadArroz && (
            <p className="text-destructive text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.variedadArroz.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Fecha de Producción</label>
            <Input
              type="date"
              {...register("fechaProduccion")}
              className={errors.fechaProduccion ? "border-destructive" : ""}
            />
            {errors.fechaProduccion && (
              <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.fechaProduccion.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Fecha de Vencimiento</label>
            <Input
              type="date"
              {...register("fechaVencimiento")}
              className={errors.fechaVencimiento ? "border-destructive" : ""}
            />
            {errors.fechaVencimiento && (
              <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.fechaVencimiento.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Guardando..." : batch ? "Actualizar Lote" : "Crear Lote"}
        </Button>
      </form>
    </Card>
  )
}
