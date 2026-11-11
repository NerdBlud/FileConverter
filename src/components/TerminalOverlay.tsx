import { useRef, useEffect, useState } from "react";
import { Download, Copy, Check, Clock } from "lucide-react";
import type { ConversionStatus } from "@/hooks/useConverter";

interface TerminalOverlayProps {
  status: ConversionStatus;
  progress: number;
  logs: string[];
  resultUrl: string | null;
  resultFilename: string | null;
  error: string | null;
  elapsedMs?: number;
  onReset: () => void;
}

export function TerminalOverlay({
  status,
  progress,
  logs,
  resultUrl,
  resultFilename,
  error,
  elapsedMs = 0,
  onReset,
}: TerminalOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(logs.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = (elapsedMs / 1000).toFixed(1) + "s";

  const statusText =
    status === "loading"
      ? "Preparing conversion"
      : status === "converting"
      ? `Converting · ${Math.round(progress * 100)}%`
      : status === "done"
      ? "Conversion complete"
      : status === "error"
      ? "Conversion failed"
      : "Ready";

  return (
    <div className="border border-slate-200 rounded-2xl p-4 sm:p-6 bg-white text-slate-950 space-y-4 animate-pop-in">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            role="status"
            className={`text-base font-semibold ${
              status === "done"
                ? "text-blue-700"
                : status === "error"
                ? "text-red-700"
                : "text-slate-950"
            }`}
          >
            {statusText}
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-600">
          {(status === "converting" || status === "done") && (
            <span className="flex items-center gap-1 text-xs text-slate-600">
              <Clock className="h-3 w-3 text-blue-700" />
              {formattedTime}
            </span>
          )}
        </div>
      </div>

      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-blue-700 h-full transition-all duration-200"
          style={{ width: `${Math.max(progress * 100, status === "loading" ? 10 : 0)}%` }}
        />
      </div>

      <details open={status === "error"} className="space-y-3">
        <summary className="w-fit cursor-pointer rounded-sm text-sm font-medium text-slate-600">
          Conversion log
        </summary>
        <div
          ref={scrollRef}
          className="max-h-52 overflow-y-auto font-mono bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1.5 text-slate-600"
        >
          {logs.length === 0 ? (
            <p className="text-slate-600 flex items-center gap-1">
              <span>Running</span>
              <span className="inline-block w-1.5 h-3.5 bg-blue-700 animate-cursor" />
            </p>
          ) : (
            <>
              {logs.map((log, i) => (
                <p
                  key={i}
                  className={`leading-relaxed break-all ${
                    log.includes("Processing complete") || log.includes("Done")
                      ? "text-blue-700 font-bold"
                      : log.includes("Error") || log.includes("failed")
                      ? "text-red-700"
                      : "text-slate-600"
                  }`}
                >
                  <span className="text-slate-600 select-none">&gt; </span>
                  {log}
                </p>
              ))}
              {(status === "converting" || status === "loading") && (
                <p className="text-blue-700 flex items-center gap-1">
                  <span className="text-slate-600 select-none">&gt; </span>
                  <span className="inline-block w-2 h-3.5 bg-blue-700 animate-cursor" />
                </p>
              )}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopyLogs}
          className="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md px-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-blue-700"
          title="Copy logs"
        >
          {copied ? <Check className="h-3 w-3 text-blue-700" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? "Copied" : "Copy log"}</span>
        </button>
      </details>

      {status === "done" && resultUrl && (
        <div className="flex flex-wrap items-center gap-2 pt-2 animate-pop-in">
          <a
            href={resultUrl}
            download={resultFilename ?? "converted-file"}
            className="flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-800"
          >
            <Download className="h-4 w-4" />
            <span className="min-w-0 truncate">Download {resultFilename}</span>
          </a>
          <button
            type="button"
            onClick={onReset}
            className="min-h-11 cursor-pointer rounded-lg px-3 text-sm font-medium text-blue-700 hover:bg-blue-50"
          >
            Convert another
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-2 pt-2 animate-pop-in">
          <p className="text-xs text-red-700 border border-red-200 p-2.5 rounded-lg bg-red-50">
            {error || "Conversion failed."}
          </p>
          <button
            type="button"
            onClick={onReset}
            className="w-full h-11 rounded-xl border border-slate-200 text-slate-950 hover:border-blue-600 hover:text-blue-700 text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95"
          >
            Choose different files
          </button>
        </div>
      )}
    </div>
  );
}
