"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UniverAPI = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UniverInstance = any;

export interface IWorkbookData {
  id?: string;
  name?: string;
  appVersion?: string;
  sheets?: Record<string, unknown>;
  styles?: Record<string, unknown> | unknown[];
  sheetOrder?: string[];
  [key: string]: unknown;
}

interface UseUniverReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  loadWorkbookData: (data: IWorkbookData) => void;
}

const BLANK_ID = "proforma-blank";

export function useUniver(): UseUniverReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const univerRef = useRef<{ univer: UniverInstance; univerAPI: UniverAPI } | null>(null);
  const currentIdRef = useRef<string>(BLANK_ID);

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    async function init() {
      try {
        setIsLoading(true);
        setError(null);

        const [
          { createUniver, LocaleType, merge },
          { UniverSheetsCorePreset },
          sheetsCoreEnUS,
        ] = await Promise.all([
          import("@univerjs/presets"),
          import("@univerjs/presets/preset-sheets-core"),
          import("@univerjs/presets/preset-sheets-core/locales/en-US"),
        ]);

        // @ts-expect-error — CSS import has no type declarations
        await import("@univerjs/presets/lib/styles/preset-sheets-core.css");

        if (!mounted || !containerRef.current) return;

        const { univerAPI, univer } = createUniver({
          locale: LocaleType.EN_US,
          locales: {
            [LocaleType.EN_US]: merge({}, sheetsCoreEnUS.default ?? sheetsCoreEnUS),
          },
          presets: [UniverSheetsCorePreset({ container: containerRef.current })],
        });

        univerRef.current = { univer, univerAPI };
        (window as unknown as { univerAPI: UniverAPI }).univerAPI = univerAPI;

        // Create initial blank workbook
        currentIdRef.current = BLANK_ID;
        univerAPI.createWorkbook({
          id: BLANK_ID,
          name: "Pro Forma",
          sheets: {
            "sheet-1": { id: "sheet-1", name: "Pro Forma", rowCount: 100, columnCount: 26, cellData: {} },
          },
        });

        if (mounted) {
          setIsReady(true);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("[useUniver] init failed:", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to initialize spreadsheet");
          setIsLoading(false);
        }
      }
    }

    void init();

    return () => {
      mounted = false;
      if (univerRef.current) {
        univerRef.current.univer.dispose();
        univerRef.current = null;
      }
    };
  }, []);

  const loadWorkbookData = useCallback((data: IWorkbookData) => {
    const api = univerRef.current?.univerAPI;
    if (!api) return;
    try {
      // disposeUnit fully removes the old workbook from Univer's registry.
      // Using workbook.dispose() only disposes the facade — the unit stays
      // registered, so createWorkbook() with the same ID returns the cached one.
      if (currentIdRef.current) {
        api.disposeUnit?.(currentIdRef.current);
      }

      // Give each load a unique ID so Univer always treats it as a new workbook
      const newId = `proforma-${Date.now()}`;
      currentIdRef.current = newId;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      api.createWorkbook({ ...data, id: newId } as any);
    } catch (err) {
      console.error("[useUniver] loadWorkbookData failed:", err);
    }
  }, []); // stable — only reads from refs

  return { containerRef, isReady, isLoading, error, loadWorkbookData };
}
