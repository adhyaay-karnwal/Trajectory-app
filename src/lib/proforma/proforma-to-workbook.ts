import type { ProformaData, ProformaRow } from "@/lib/proforma-types";
import type { IWorkbookData } from "./useUniver";

type Cell = { v?: string | number | boolean | null };
type CellDataMap = Record<number, Record<number, Cell>>;

function numFmtDisplay(v: number, format?: ProformaRow["format"]): string {
  switch (format) {
    case "currency": return "$" + Math.round(v).toLocaleString("en-US");
    case "percent":  return (v * 100).toFixed(1) + "%";
    case "x":        return v.toFixed(2) + "x";
    default:         return String(v);
  }
}

export function proformaToWorkbook(data: ProformaData): IWorkbookData {
  const cellData: CellDataMap = {};
  let row = 0;

  const set = (r: number, col: number, v: string | number | null) => {
    if (!cellData[r]) cellData[r] = {};
    if (v !== null && v !== undefined) cellData[r][col] = { v };
  };

  // Header
  set(row++, 0, data.metadata.projectName || "Pro Forma");
  if (data.metadata.address) set(row++, 0, data.metadata.address);
  const meta = [
    data.metadata.assetType,
    data.metadata.units ? `${data.metadata.units} Units` : null,
    data.metadata.buildingSF ? `${data.metadata.buildingSF.toLocaleString()} SF` : null,
  ].filter(Boolean).join(" · ");
  if (meta) set(row++, 0, meta);
  row++; // blank

  // Column headers
  set(row, 0, "Line Item");
  data.years.forEach((y, i) => set(row, i + 1, y));
  row++;

  // Data rows
  for (const r of data.rows) {
    if (r.kind === "spacer") { row++; continue; }

    const indent = "  ".repeat(r.indent ?? 0);
    set(row, 0, indent + r.label);

    if (r.kind !== "section") {
      r.values.forEach((v, i) => {
        if (v !== null && v !== undefined) {
          set(row, i + 1, numFmtDisplay(v, r.format));
        }
      });
    }
    row++;
  }

  const colCount = data.years.length + 1;
  const columnData: Record<number, { w: number }> = { 0: { w: 240 } };
  data.years.forEach((_, i) => { columnData[i + 1] = { w: 110 }; });

  return {
    id: "proforma-workbook",
    name: data.metadata.projectName || "Pro Forma",
    appVersion: "1.0.0",
    sheets: {
      "sheet-1": {
        id: "sheet-1",
        name: "Pro Forma",
        rowCount: Math.max(row + 10, 60),
        columnCount: Math.max(colCount + 2, 10),
        cellData,
        columnData,
        defaultRowHeight: 24,
        defaultColumnWidth: 100,
      },
    },
    sheetOrder: ["sheet-1"],
  };
}
