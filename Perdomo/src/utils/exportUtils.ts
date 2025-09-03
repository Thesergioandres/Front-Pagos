import * as XLSX from "xlsx";

export function exportToExcel(
  data: Record<string, unknown>[],
  fileName: string
) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Cartera");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

// Para exportar a PDF se recomienda usar jsPDF o similar
// Aquí solo se deja la función de Excel por simplicidad
