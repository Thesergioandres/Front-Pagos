import React, { useRef } from "react";

interface ExcelUploadProps {
  onImport: (file: File) => Promise<void>;
  loading: boolean;
  className?: string;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({
  onImport,
  loading,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Evitar múltiples envíos si ya está cargando
    if (loading) {
      console.warn(
        "[ExcelUpload] Intento de subida bloqueado: ya hay una importación en curso"
      );
      return;
    }

    console.log(`[ExcelUpload] Iniciando importación de: ${file.name}`);
    try {
      await onImport(file);
    } catch (error) {
      console.error("[ExcelUpload] Error en importación:", error);
    } finally {
      // Limpiar el input para permitir subir el mismo archivo de nuevo si es necesario
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={className}>
      <label className="cursor-pointer inline-flex items-center px-4 py-2 rounded border border-white text-white bg-black hover:bg-black/90 transition mb-2">
        {loading ? "Importando..." : "Importar Excel"}
        <input
          type="file"
          accept=".xlsx,.xls"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={loading}
        />
      </label>
      {/* Solo input para Excel, XML eliminado */}
    </div>
  );
};

export default ExcelUpload;
