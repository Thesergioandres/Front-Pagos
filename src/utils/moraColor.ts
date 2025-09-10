// Mapea el color de mora del backend ("rojo", "amarillo", "verde") o días de mora a un color CSS legible en la UI
// Preferimos tonos claros para mantener el contraste con el texto oscuro.

export function mapMoraColor(
  input: string | number | undefined | null
): string {
  if (input == null) return "";

  // Si es número, aplicamos la misma lógica del back: <0 verde, <=10 amarillo, >10 rojo
  if (typeof input === "number" && !Number.isNaN(input)) {
    if (input < 0) return "#dcfce7"; // green-100
    if (input <= 10) return "#fef9c3"; // yellow-100
    return "#fee2e2"; // red-200
  }

  // Si es string, normalizamos y mapeamos nombres en español
  const s = String(input).trim().toLowerCase();
  switch (s) {
    case "verde":
      return "#dcfce7"; // green-100
    case "amarillo":
      return "#fef9c3"; // yellow-100
    case "rojo":
      return "#fee2e2"; // red-200
    default:
      // fallback: si envían un color CSS válido (por ejemplo, "#rrggbb" o "red") lo dejamos pasar
      return s;
  }
}
