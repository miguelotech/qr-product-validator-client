# QR Product Validator Client

Sistema de gestión de productos con validación mediante códigos QR construido con Next.js 15, React 19, TypeScript y Tailwind CSS.

## 🚀 Características

- **Gestión de Productos**: Crear, editar, eliminar productos con imágenes
- **Gestión de Lotes**: Crear lotes de productos con fechas de producción y vencimiento
- **Validación QR**: Sistema de validación mediante códigos QR
- **UI Moderna**: Interfaz construida con Tailwind CSS y componentes Shadcn/UI
- **Responsive**: Diseño adaptable a dispositivos móviles y desktop

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI
- **Validación**: Zod, React Hook Form
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o pnpm
- Backend API ejecutándose en `http://localhost:8081`

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/miguelotech/qr-product-validator-client.git
cd qr-product-validator-client
```

2. **Instalar dependencias**
```bash
npm install --legacy-peer-deps
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── products/          # Páginas de gestión de productos
│   ├── validate/          # Páginas de validación pública
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI (Shadcn)
│   ├── batch-card.tsx    # Tarjeta de lote
│   ├── batch-form.tsx    # Formulario de lote
│   ├── product-card.tsx  # Tarjeta de producto
│   └── product-form.tsx  # Formulario de producto
├── lib/                   # Utilidades y configuración
│   ├── api.ts           # Funciones de API
│   ├── utils.ts         # Utilidades generales
│   └── validation.ts    # Esquemas de validación
└── public/               # Archivos estáticos
```

## 🔗 API Endpoints

La aplicación se conecta a un backend API en `http://localhost:8081`:

### Productos
- `GET /admin/products` - Listar productos
- `POST /admin/products` - Crear producto
- `PUT /admin/products/:id` - Actualizar producto
- `DELETE /admin/products/:id` - Eliminar producto

### Lotes
- `GET /admin/products/:id/batches` - Listar lotes
- `POST /admin/products/:id/batches` - Crear lote
- `PUT /admin/products/:id/batches/:batchId` - Actualizar lote
- `DELETE /admin/products/:id/batches/:batchId` - Eliminar lote

### Validación Pública
- `GET /products/:batchId` - Validar lote (público)

## 🌐 Rutas de la Aplicación

- `/products` - Gestión de productos
- `/products/[id]/batches` - Gestión de lotes de un producto
- `/validate/[batchId]` - Validación pública de lote

## 🔧 Configuración

### Variables de Entorno
Crear archivo `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8081
```

### Configuración de Imágenes
Las imágenes se sirven desde el backend a través de rewrites configurados en `next.config.mjs`:
- QR Codes: `/uploads/qrs/`
- Product Images: `/uploads/products/`

## 📱 Funcionalidades

### Gestión de Productos
- ✅ Crear productos con imagen
- ✅ Editar información de productos
- ✅ Eliminar productos
- ✅ Vista de lista con tarjetas

### Gestión de Lotes
- ✅ Crear lotes con fechas
- ✅ Validación de fechas (vencimiento > producción)
- ✅ Generación automática de códigos QR
- ✅ Estado de vencimiento visual

### Validación Pública
- ✅ Página pública para validar lotes
- ✅ Información completa del producto y lote
- ✅ Descarga de código QR
- ✅ Indicador de estado (válido/vencido)

## 🚀 Deployment

### Vercel (Recomendado)
```bash
npm run build
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request


**Alexander Miguel Chang Cruz**
- GitHub: [@miguelotech](https://github.com/miguelotech)