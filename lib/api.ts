// API utilities for communicating with the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081"

// Helper function to build full image URLs
const buildImageUrl = (path: string | null | undefined): string => {
  if (!path) return "/placeholder.svg"
  if (path.startsWith("http")) return path

  // Ensure API_BASE_URL has no trailing slash and path has a leading slash
  const base = API_BASE_URL.replace(/\/+$/, "")
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${base}${normalizedPath}`
}

export interface Product {
  id: number
  name: string
  image: string
  registroSanitario: string
}

export interface ProductBatch {
  id: string
  product: Product
  numeroMaquilla: string
  variedadArroz: string
  fechaProduccion: string
  fechaVencimiento: string
  qrCodeUrl: string
}

export interface CreateProductInput {
  name: string
  registroSanitario: string
}

export interface CreateBatchInput {
  numeroMaquilla: string
  variedadArroz: string
  fechaProduccion: string
  fechaVencimiento: string
}

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const res = await fetch(`${API_BASE_URL}/admin/products`)
    if (!res.ok) throw new Error("Failed to fetch products")
    return res.json()
  },

  getById: async (id: number): Promise<Product> => {
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`)
    if (!res.ok) throw new Error("Failed to fetch product")
    return res.json()
  },

  create: async (data: CreateProductInput, image?: File): Promise<Product> => {
    if (image) {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("registroSanitario", data.registroSanitario)
      formData.append("image", image)
      const res = await fetch(`${API_BASE_URL}/admin/products/with-image`, {
        method: "POST",
        body: formData,
      })
      if (!res.ok) throw new Error("Failed to create product")
      return res.json()
    } else {
      const res = await fetch(`${API_BASE_URL}/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to create product")
      return res.json()
    }
  },

  update: async (id: number, data: CreateProductInput, image?: File): Promise<Product> => {
    if (image) {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("registroSanitario", data.registroSanitario)
      formData.append("image", image)
      const res = await fetch(`${API_BASE_URL}/admin/products/${id}/with-image`, {
        method: "PUT",
        body: formData,
      })
      if (!res.ok) throw new Error("Failed to update product")
      return res.json()
    } else {
      const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to update product")
      return res.json()
    }
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: "DELETE",
    })
    if (!res.ok) throw new Error("Failed to delete product")
  },
}

// Batches API
export const batchesApi = {
  getByProduct: async (productId: number): Promise<ProductBatch[]> => {
    const res = await fetch(`${API_BASE_URL}/admin/products/${productId}/batches`)
    if (!res.ok) throw new Error("Failed to fetch batches")
    return res.json()
  },

  getById: async (productId: number, batchId: string): Promise<ProductBatch> => {
    const res = await fetch(`${API_BASE_URL}/admin/products/${productId}/batches/${batchId}`)
    if (!res.ok) throw new Error("Failed to fetch batch")
    return res.json()
  },

  create: async (productId: number, data: CreateBatchInput): Promise<ProductBatch> => {
    const res = await fetch(`${API_BASE_URL}/admin/products/${productId}/batches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to create batch")
    return res.json()
  },

  update: async (productId: number, batchId: string, data: CreateBatchInput): Promise<ProductBatch> => {
    const res = await fetch(`${API_BASE_URL}/admin/products/${productId}/batches/${batchId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to update batch")
    return res.json()
  },

  delete: async (productId: number, batchId: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/admin/products/${productId}/batches/${batchId}`, {
      method: "DELETE",
    })
    if (!res.ok) throw new Error("Failed to delete batch")
  },
}

// Public validation API
export const validationApi = {
  validate: async (batchId: string): Promise<ProductBatch> => {
    const res = await fetch(`${API_BASE_URL}/products/${batchId}`)
    if (!res.ok) throw new Error("Failed to validate product")
    return res.json()
  },
}

// Helper functions for image URLs
export const imageUtils = {
  getProductImageUrl: (product: Product): string => buildImageUrl(product.image),
  getQRCodeUrl: (batch: ProductBatch): string => buildImageUrl(batch.qrCodeUrl),
}

// Helper functions for date handling
export const dateUtils = {
  // Convert date string to Date object without timezone issues
  parseDate: (dateString: string): Date => {
    // If the date string is in YYYY-MM-DD format, parse it as local date
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-').map(Number)
      return new Date(year, month - 1, day) // month is 0-indexed
    }
    return new Date(dateString)
  },
  
  // Format date for display
  formatDate: (dateString: string): string => {
    const date = dateUtils.parseDate(dateString)
    return date.toLocaleDateString("es-ES", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  },
  
  // Format date for input fields (YYYY-MM-DD)
  formatDateForInput: (dateString: string): string => {
    const date = dateUtils.parseDate(dateString)
    return date.toISOString().split('T')[0]
  },
  
  // Check if date is expired
  isExpired: (dateString: string): boolean => {
    const date = dateUtils.parseDate(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day
    return date < today
  }
}
