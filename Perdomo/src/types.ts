export type Rol = "Administrador" | "Vendedor" | "Distribuidor";

export interface Usuario {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
}

// Estructura de pago/factura según lo que envía el backend:
export type Payment = {
  factura: string;
  codigo: string;
  cliente: string;
  tipoFactura: string;
  valorFactura: number;
  poblacion: string;
  condicionPago: string;
  fechaFactura: string;
  saldo: number;
  vendedor: string;
  observacion: string;
  estado: string;
  descuento: number;
  apoyoAniversario: number;
  retencionFuente: number;
  ica: number;
  abono: number;
};
