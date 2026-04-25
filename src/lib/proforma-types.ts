// Shared proforma types used across generate API, export API, and UI components.

export interface ProformaData {
  metadata: {
    projectName: string;
    address: string;
    assetType: string;
    units?: number | null;
    buildingSF?: number | null;
  };
  years: string[]; // e.g. ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"]
  rows: ProformaRow[];
}

export interface ProformaRow {
  kind: "section" | "data" | "total" | "spacer";
  label: string;
  key: string;
  section: string;
  values: (number | null)[];
  format?: "currency" | "percent" | "x" | "number" | "text";
  bold?: boolean;
  editable?: boolean;
  indent?: number;
}
