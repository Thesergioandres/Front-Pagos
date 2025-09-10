// Tipo para la tabla de cartera
export type CarteraFactura = {
  facturaId: string;
  cliente: string;
  valor: number;
  saldoPendiente: number;
  fechaVencimiento: string;
  diasMora: number;
  color: string;
};

// Tipo para facturas vencidas
export type FacturaVencida = {
  factura: string;
  cliente: string;
  fechaVencimiento: string;
  diasMora: number;
  saldoPendiente: number;
};

// Alias para usar Payment como Factura (estructura igual)
export type Factura = Payment;
// Roles alineados con Cognito/backend (claim cognito:groups)
export type Rol = "GERENTE" | "VENDEDOR" | "DISTRIBUIDOR";

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
  registradoPor?: string;
};
