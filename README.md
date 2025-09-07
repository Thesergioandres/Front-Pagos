# Sistema de Pagos Perdomo

Aplicación web para la gestión de pagos y facturas, desarrollada con **React**, **TypeScript** y **TailwindCSS**. Permite visualizar, filtrar, crear, editar, eliminar e importar pagos desde archivos Excel.

## Características

- Visualización de pagos/facturas en una tabla detallada.
- Filtro de pagos por cualquier campo.
- Formulario para crear y editar pagos.
- Eliminación de pagos existentes.
- Importación de pagos desde archivos Excel (`.xlsx`, `.xls`).
- Interfaz moderna y responsiva con TailwindCSS.

## Configuración

La app espera un backend corriendo en `http://localhost:8080/perdomo-api`. Asegúrate de que el backend esté disponible y exponga los siguientes endpoints:

- `GET /api/facturas` — Listar pagos
- `POST /api/facturas/crear-factura` — Crear pago
- `PUT /api/facturas/actualizar` — Actualizar pago
- `DELETE /api/facturas/{facturaId}` — Eliminar pago
- `POST /api/facturas/importar-excel` — Importar pagos desde Excel

## Estructura del Proyecto

- `src/App.tsx`: Componente principal de la aplicación.
- `src/Components/PaymentsForm.tsx`: Formulario de creación/edición de pagos.
- `src/Components/PaymentTable.tsx`: Tabla de visualización de pagos.
- `src/Components/ExcelUpload.tsx`: Componente para importar archivos Excel.
- `src/Components/PaymentFilter.tsx`: Filtro de búsqueda.
- `src/types.ts`: Tipos TypeScript para pagos y usuarios.

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
