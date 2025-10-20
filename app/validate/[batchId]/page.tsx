"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { validationApi, type ProductBatch, imageUtils, dateUtils } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, Loader, Download, CheckCircle, XCircle } from "lucide-react"

export default function ValidationPage() {
  const params = useParams()
  const batchId = params.batchId as string

  const [batch, setBatch] = useState<ProductBatch | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    loadBatch()
  }, [batchId])

  const loadBatch = async () => {
    try {
      setIsLoading(true)
      const data = await validationApi.validate(batchId)
      setBatch(data)
      setIsExpired(dateUtils.isExpired(data.fechaVencimiento))
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Producto no encontrado")
    } finally {
      setIsLoading(false)
    }
  }

  const downloadQR = () => {
    if (!batch?.qrCodeUrl) return
    const link = document.createElement("a")
    link.href = imageUtils.getQRCodeUrl(batch)
    link.download = `qr-${batch.id}.png`
    link.click()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !batch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Producto No Encontrado</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Intentar de Nuevo</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Validación de Producto</h1>
          <p className="text-muted-foreground">Información verificada del producto</p>
        </div>

        <Card className="overflow-hidden">
          {/* Status Banner */}
          <div className={`p-4 ${isExpired ? "bg-destructive/10" : "bg-green-500/10"}`}>
            <div className="flex items-center justify-center gap-2">
              {isExpired ? (
                <>
                  <XCircle className="w-5 h-5 text-destructive" />
                  <span className="font-semibold text-destructive">Producto Vencido</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-600">Producto Vigente</span>
                </>
              )}
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Product Image */}
            {batch.product.image && (
              <div className="flex justify-center">
                <img
                  src={imageUtils.getProductImageUrl(batch.product)}
                  alt={batch.product.name}
                  className="w-48 h-48 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-center">{batch.product.name}</h2>
                <p className="text-center text-muted-foreground mt-2">
                  Registro Sanitario: {batch.product.registroSanitario}
                </p>
              </div>
            </div>

            {/* Batch Details */}
            <div className="grid grid-cols-2 gap-6 bg-muted p-6 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Número de Maquilla</p>
                <p className="font-semibold text-lg">{batch.numeroMaquilla}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Variedad</p>
                <p className="font-semibold text-lg">{batch.variedadArroz}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Fecha de Producción</p>
                <p className="font-semibold text-lg">{dateUtils.formatDate(batch.fechaProduccion)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Fecha de Vencimiento</p>
                <p className={`font-semibold text-lg ${isExpired ? "text-destructive" : "text-green-600"}`}>
                  {dateUtils.formatDate(batch.fechaVencimiento)}
                </p>
              </div>
            </div>

            {/* QR Code */}
            {batch.qrCodeUrl && (
              <div className="flex flex-col items-center gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <img src={imageUtils.getQRCodeUrl(batch)} alt="QR Code" className="w-48 h-48" />
                </div>
                <Button onClick={downloadQR} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Código QR
                </Button>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground border-t border-border pt-6">
              <p>Este producto ha sido verificado y validado por nuestro sistema</p>
              <p className="mt-2">ID del Lote: {batch.id}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
