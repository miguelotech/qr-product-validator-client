// Form validation schemas using Zod
import { z } from "zod"

export const productFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  registroSanitario: z.string().min(1, "El registro sanitario es requerido"),
})

export const batchFormSchema = z
  .object({
    numeroMaquilla: z.string().min(1, "El número de maquilla es requerido"),
    variedadArroz: z.string().min(1, "La variedad de arroz es requerida"),
    fechaProduccion: z.string().min(1, "La fecha de producción es requerida"),
    fechaVencimiento: z.string().min(1, "La fecha de vencimiento es requerida"),
  })
  .refine((data) => {
    // Parse dates correctly to avoid timezone issues
    const fechaProduccion = new Date(data.fechaProduccion + 'T00:00:00')
    const fechaVencimiento = new Date(data.fechaVencimiento + 'T00:00:00')
    return fechaVencimiento > fechaProduccion
  }, {
    message: "La fecha de vencimiento debe ser posterior a la fecha de producción",
    path: ["fechaVencimiento"],
  })

export type ProductFormData = z.infer<typeof productFormSchema>
export type BatchFormData = z.infer<typeof batchFormSchema>
