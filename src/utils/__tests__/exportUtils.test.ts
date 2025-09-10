import { describe, it, expect, vi } from "vitest";

vi.mock("xlsx", () => {
  const utils = {
    json_to_sheet: vi.fn(() => ({})),
    book_new: vi.fn(() => ({ Sheets: {}, SheetNames: [] })),
    book_append_sheet: vi.fn(),
  };
  const writeFile = vi.fn();
  return { utils, writeFile } as any;
});

import * as XLSX from "xlsx";
import { exportToExcel } from "../exportUtils";

describe("exportUtils", () => {
  it("llama a writeFile con el nombre esperado", () => {
    const spy = XLSX.writeFile as unknown as ReturnType<typeof vi.fn>;
    exportToExcel([{ a: 1 }], "reporte");
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][1]).toMatch(/reporte\.xlsx$/);
  });
});
