import { useState, useCallback, useRef, useEffect } from "react";
import {
  detectCategory,
  getFileExtension,
  buildFFmpegCommand,
  type ConversionTarget,
  type ConversionOptions,
} from "@/lib/conversions";
import { mergePDFs, imagesToPDF } from "@/lib/pdf-utils";

export type ConversionStatus = "idle" | "loading" | "converting" | "done" | "error";

interface ConverterState {
  status: ConversionStatus;
  progress: number;
  logs: string[];
  resultUrl: string | null;
  resultFilename: string | null;
  error: string | null;
  elapsedMs: number;
}

export function useConverter() {
  const workerRef = useRef<Worker | null>(null);
  const resultUrlRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const [state, setState] = useState<ConverterState>({
    status: "idle",
    progress: 0,
    logs: [],
    resultUrl: null,
    resultFilename: null,
    error: null,
    elapsedMs: 0,
  });

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    startTimeRef.current = Date.now();
    timerRef.current = window.setInterval(() => {
      setState((prev) => ({
        ...prev,
        elapsedMs: Date.now() - startTimeRef.current,
      }));
    }, 100);
  }, [stopTimer]);

  const addLog = useCallback((message: string) => {
    setState((prev) => ({
      ...prev,
      logs: [...prev.logs, message],
    }));
  }, []);

  const cleanup = useCallback(() => {
    stopTimer();
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
  }, [stopTimer]);

  const reset = useCallback(() => {
    cleanup();
    setState({
      status: "idle",
      progress: 0,
      logs: [],
      resultUrl: null,
      resultFilename: null,
      error: null,
      elapsedMs: 0,
    });
  }, [cleanup]);

  useEffect(() => {
    return () => {
      cleanup();
      if (workerRef.current) {
        workerRef.current.postMessage({ type: "TERMINATE" });
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [cleanup]);

  const convert = useCallback(
    async (files: File[], target: ConversionTarget, options?: ConversionOptions) => {
      cleanup();
      startTimer();
      setState({
        status: "loading",
        progress: 0,
        logs: [],
        resultUrl: null,
        resultFilename: null,
        error: null,
        elapsedMs: 0,
      });

      const file = files[0];
      const category = detectCategory(file);
      const isImagesToPdf = category === "image" && target.ext === "pdf";
      const isPdfMerge = category === "document" && target.ext === "pdf";

      if (isPdfMerge || isImagesToPdf) {
        try {
          if (isPdfMerge) {
            addLog(`Merging ${files.length} document(s)...`);
            setState((prev) => ({ ...prev, status: "converting", progress: 0.4 }));
            const blob = await mergePDFs(files);
            const url = URL.createObjectURL(blob);
            resultUrlRef.current = url;
            stopTimer();
            setState((prev) => ({
              ...prev,
              status: "done",
              progress: 1,
              resultUrl: url,
              resultFilename: `merged-${Date.now()}.pdf`,
            }));
          } else {
            addLog(`Compiling ${files.length} image(s) to PDF...`);
            setState((prev) => ({ ...prev, status: "converting", progress: 0.5 }));
            const blob = await imagesToPDF(files);
            const url = URL.createObjectURL(blob);
            resultUrlRef.current = url;
            stopTimer();
            const baseName = file.name.replace(/\.[^.]+$/, "");
            setState((prev) => ({
              ...prev,
              status: "done",
              progress: 1,
              resultUrl: url,
              resultFilename: `${baseName}.pdf`,
            }));
          }
        } catch (err) {
          stopTimer();
          const message = err instanceof Error ? err.message : "PDF process failed";
          addLog(`Error: ${message}`);
          setState((prev) => ({ ...prev, status: "error", error: message }));
        }
        return;
      }

      try {
        if (!workerRef.current) {
          workerRef.current = new Worker(
            new URL("../worker.ts", import.meta.url),
            { type: "module" }
          );
        }

        const worker = workerRef.current;
        const inputExt = getFileExtension(file) || "tmp";
        const inputName = `input.${inputExt}`;
        const outputName = `output.${target.ext}`;
        const command = buildFFmpegCommand(inputName, outputName, inputExt, target.ext, options);
        const baseName = file.name.replace(/\.[^.]+$/, "");

        worker.onmessage = (e: MessageEvent) => {
          const msg = e.data;
          switch (msg.type) {
            case "LOG":
              addLog(msg.message);
              break;
            case "PROGRESS":
              setState((prev) => ({
                ...prev,
                status: "converting",
                progress: msg.progress,
              }));
              break;
            case "DONE": {
              stopTimer();
              const blob = new Blob([msg.data], { type: target.mimeType });
              const url = URL.createObjectURL(blob);
              resultUrlRef.current = url;
              setState((prev) => ({
                ...prev,
                status: "done",
                progress: 1,
                resultUrl: url,
                resultFilename: `${baseName}.${target.ext}`,
              }));
              break;
            }
            case "ERROR":
              stopTimer();
              addLog(`Error: ${msg.message}`);
              setState((prev) => ({
                ...prev,
                status: "error",
                error: msg.message,
              }));
              break;
          }
        };

        worker.onerror = (err) => {
          stopTimer();
          addLog(`Worker error: ${err.message}`);
          setState((prev) => ({
            ...prev,
            status: "error",
            error: err.message,
          }));
        };

        addLog(`Target: .${target.ext.toUpperCase()}`);
        addLog(`Processing: ${file.name}`);
        
        const fileData = await file.arrayBuffer();

        worker.postMessage(
          { type: "CONVERT", fileData, inputName, outputName, command },
          { transfer: [fileData] }
        );
      } catch (err) {
        stopTimer();
        const message = err instanceof Error ? err.message : "Conversion failed";
        addLog(`Error: ${message}`);
        setState((prev) => ({ ...prev, status: "error", error: message }));
      }
    },
    [addLog, cleanup, startTimer, stopTimer]
  );

  return { ...state, convert, reset };
}
