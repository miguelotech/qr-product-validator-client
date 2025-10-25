"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { validationApi, type ProductBatch, imageUtils, dateUtils } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, Loader, Download, CheckCircle, XCircle, Hash, Tag, Calendar } from "lucide-react"

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
          <p className="text-muted-foreground">Información verificada</p>
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
            {/* Brand: logo + name */}
            <div className="flex items-center justify-center gap-4">
              <img
                src="/logo.png"
                alt="Molino El Cholo"
                className="w-20 h-20 object-contain rounded"
              />
              <div className="text-center">
                <h3 className="text-xl font-bold">Molino El Cholo</h3>
                <p className="text-sm text-muted-foreground">Calidad desde Guadalupe</p>
              </div>
            </div>

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

            {/* Batch Details (beautiful card row) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Maquilla */}
              <div className="flex flex-col items-center text-center p-5 bg-gradient-to-br from-white/60 to-muted/5 border border-border rounded-2xl shadow-md md:hover:shadow-lg md:transform md:hover:-translate-y-0.5 transition-all relative w-full break-words">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-gradient-to-br from-amber-400 to-amber-600 text-white">
                  <Hash className="w-5 h-5" />
                </div>
                <p className="text-xs uppercase text-muted-foreground tracking-wide">Número de Maquilla</p>
                <p className="mt-1 text-xl font-extrabold">{batch.numeroMaquilla}</p>
              </div>

              {/* Variedad */}
              <div className="flex flex-col items-center text-center p-5 bg-gradient-to-br from-white/60 to-muted/5 border border-border rounded-2xl shadow-md md:hover:shadow-lg md:transform md:hover:-translate-y-0.5 transition-all relative w-full break-words">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-gradient-to-br from-sky-400 to-sky-600 text-white">
                  <Tag className="w-5 h-5" />
                </div>
                <p className="text-xs uppercase text-muted-foreground tracking-wide">Variedad</p>
                <p className="mt-1 text-xl font-extrabold">{batch.variedadArroz}</p>
              </div>

              {/* Fecha Producción */}
              <div className="flex flex-col items-center text-center p-5 bg-gradient-to-br from-white/60 to-muted/5 border border-border rounded-2xl shadow-md md:hover:shadow-lg md:transform md:hover:-translate-y-0.5 transition-all relative w-full break-words">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-gradient-to-br from-sky-300 to-sky-500 text-white">
                  <Calendar className="w-5 h-5" />
                </div>
                <p className="text-xs uppercase text-muted-foreground tracking-wide">Fecha de Producción</p>
                <p className="mt-1 text-xl font-extrabold">{dateUtils.formatDate(batch.fechaProduccion)}</p>
              </div>

              {/* Fecha Vencimiento */}
              <div className="flex flex-col items-center text-center p-5 border rounded-2xl shadow-md md:hover:shadow-lg md:transform md:hover:-translate-y-0.5 transition-all relative w-full break-words"
                aria-live="polite"
              >
                <div className={`${isExpired ? 'w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-gradient-to-br from-red-400 to-red-600 text-white' : 'w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white'}`}>
                  <Calendar className="w-5 h-5" />
                </div>
                <p className="text-xs uppercase text-muted-foreground tracking-wide">Fecha de Vencimiento</p>
                <p className={`mt-1 text-xl font-extrabold ${isExpired ? 'text-destructive' : 'text-emerald-600'}`}>{dateUtils.formatDate(batch.fechaVencimiento)}</p>
                <div className="mt-2">
                  {isExpired ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs">Vencido</span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs">Vigente</span>
                  )}
                </div>
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

            {/* Footer: company/contact info instead of batch id */}
            <div className="text-center text-sm text-muted-foreground border-t border-border pt-6 space-y-1 font-semibold">
              <p className="font-semibold">Procesado y envasado por:</p>
              <p>Mi Molino S.A.C.</p>
              <p>R.U.C. 20440442189</p>
              <p>Panamericana Norte Km. 694</p>
              <p>ahora hito Km. 707 - Guadalupe</p>
              <p>Ventas: 949445982 - 976683414</p>
              <p>Guadalupe - Perú</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
