"use client"

import type { ProductBatch } from "@/lib/api"
import { imageUtils, dateUtils } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Download, Eye } from "lucide-react"
import { useState } from "react"

interface BatchCardProps {
  batch: ProductBatch
  onEdit: (batch: ProductBatch) => void
  onDelete: (id: string) => void
}

export function BatchCard({ batch, onEdit, onDelete }: BatchCardProps) {
  const [isExpired, setIsExpired] = useState(dateUtils.isExpired(batch.fechaVencimiento))

  const downloadQR = () => {
    const link = document.createElement("a")
    link.href = imageUtils.getQRCodeUrl(batch)
    link.download = `qr-${batch.id}.png`
    link.click()
  }

  return (
    <Card className={`p-4 space-y-4 ${isExpired ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{batch.numeroMaquilla}</h3>
          <p className="text-sm text-muted-foreground">{batch.variedadArroz}</p>
        </div>
        {isExpired && (
          <span className="bg-destructive/10 text-destructive text-xs font-semibold px-2 py-1 rounded">Vencido</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Producción</p>
          <p className="font-medium">{dateUtils.formatDate(batch.fechaProduccion)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Vencimiento</p>
          <p className="font-medium">{dateUtils.formatDate(batch.fechaVencimiento)}</p>
        </div>
      </div>

      {batch.qrCodeUrl && (
        <div className="flex justify-center p-4 bg-muted rounded-lg">
          <img src={imageUtils.getQRCodeUrl(batch)} alt="QR Code" className="w-32 h-32" />
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(batch)} className="flex-1">
          <Edit2 className="w-4 h-4 mr-1" />
          Editar
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(batch.id)} className="flex-1">
          <Trash2 className="w-4 h-4 mr-1" />
          Eliminar
        </Button>
        {batch.qrCodeUrl && (
          <Button variant="outline" size="sm" onClick={downloadQR} className="flex-1 bg-transparent">
            <Eye className="w-4 h-4 mr-1" />
            QR
          </Button>
        )}
      </div>
    </Card>
  )
}
