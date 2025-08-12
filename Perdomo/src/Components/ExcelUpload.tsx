import React, { useRef } from "react";

interface ExcelUploadProps {
  onImport: (file: File) => Promise<void>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  className?: string;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({
  onImport,
  loading,
  setLoading,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      await onImport(file);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <label className={className + " cursor-pointer"}>
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
  );
};

export default ExcelUpload;
