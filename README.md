# Sistema de Pagos Perdomo

Aplicación web para la gestión de pagos y facturas, desarrollada con **React**, **TypeScript** y **TailwindCSS**. Permite visualizar, filtrar, registrar pagos, eliminar e importar desde Excel. Integración con Amazon Cognito para autenticación.

## Características

- Visualización de pagos/facturas en una tabla detallada.
- Filtro de pagos por factura o cliente.
- Registro de pagos (con observaciones y soporte para comprobante opcional en UI).
- Eliminación de facturas.
- Importación desde Excel (`.xlsx`, `.xls`).
- Reporte por vendedor, cartera y alertas de vencimiento.
- Interfaz moderna y responsiva con TailwindCSS.

## Configuración

En desarrollo, la app usa el proxy de Vite configurado en `vite.config.ts` para `/api` apuntando al API Gateway. En producción, configura `VITE_API_BASE`.

Endpoints esperados por el frontend (prefijo `/api` en dev):

- `GET /api/facturas` — Listar facturas/pagos
- `GET /api/facturas/buscar?factura=...|cliente=...` — Buscar
- `DELETE /api/facturas/{facturaId}` — Eliminar factura
- `POST /api/facturas/importar-excel` — Importar Excel (campo por defecto: `file`)
- `GET /api/facturas/alertas-vencimiento` — Alertas y facturas vencidas
- `GET /api/facturas/cartera` — Cartera
- `GET /api/pagos/historial/{facturaId}` — Historial de pagos
- `POST /api/pagos/registrar-pago` — Registrar pago
- `GET /api/reportes/vendedor/{nombre}` — Reporte por vendedor

## Estructura del Proyecto

- `src/App.tsx`: Componente principal de la aplicación.
- `src/Components/record-payments.tsx`: Formulario de registro de pagos.
- `src/Components/PaymentTable.tsx`: Tabla de visualización de pagos.
- `src/Components/ExcelUpload.tsx`: Componente para importar archivos Excel.
- `src/Components/PaymentFilter.tsx`: Filtro de búsqueda.
- `src/types.ts`: Tipos TypeScript para pagos y usuarios.
- `src/utils/moraColor.ts`: Utilidad para colorear filas por días de mora.

## Variables de entorno

En desarrollo (`.env.development` ya incluido como referencia):

```
VITE_API_BASE=/api
VITE_COGNITO_REGION=us-east-2
VITE_USER_POOL_ID=us-east-2_XXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_API_TIMEOUT_MS=60000
VITE_LIST_TIMEOUT_MS=90000
VITE_UPLOAD_TIMEOUT_MS=120000
```

En producción, apunta `VITE_API_BASE` al backend: `https://<dominio>/api`.

## Dependencias principales

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [xlsx](https://github.com/SheetJS/sheetjs) (para manejo de archivos Excel)
- [Vite](https://vitejs.dev/) (empacador y servidor de desarrollo)

## Licencia

MIT

---

Desarrollado por Oscar Mauricio.
