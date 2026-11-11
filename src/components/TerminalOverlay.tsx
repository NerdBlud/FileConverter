import { useRef, useEffect, useState } from "react";
import { Download, Copy, Check, Clock, ChevronDown } from "lucide-react";
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
    <div className="border border-workspace-line rounded-3xl p-4 sm:p-6 bg-workspace-panel text-workspace-ink space-y-4 animate-pop-in">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            role="status"
            className={`text-base font-semibold ${
              status === "done"
                ? "text-workspace-accent"
                : status === "error"
                ? "text-red-300"
                : "text-workspace-ink"
            }`}
          >
            {statusText}
          </span>
        </div>

        <div className="flex items-center gap-3 text-workspace-muted">
          {(status === "converting" || status === "done") && (
            <span className="flex items-center gap-1 text-xs text-workspace-muted">
              <Clock className="h-3 w-3 text-workspace-accent" />
              {formattedTime}
            </span>
          )}
        </div>
      </div>

      <div className="w-full bg-workspace-control h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-workspace-accent h-full transition-all duration-200"
          style={{ width: `${Math.max(progress * 100, status === "loading" ? 10 : 0)}%` }}
        />
      </div>

      <details open={status === "error"} className="disclosure rounded-2xl border border-workspace-line bg-workspace">
        <summary className="disclosure-trigger px-4 py-3">
          Conversion log
          <ChevronDown className="disclosure-chevron size-4" aria-hidden="true" />
        </summary>
        <div className="space-y-2 px-3 pb-3">
          <div
            ref={scrollRef}
            className="max-h-52 overflow-y-auto font-mono bg-workspace border border-workspace-line rounded-xl p-3.5 text-xs space-y-1.5 text-workspace-muted"
          >
            {logs.length === 0 ? (
              <p className="text-workspace-muted flex items-center gap-1">
                <span>Running</span>
                <span className="inline-block w-1.5 h-3.5 bg-workspace-accent animate-cursor" />
              </p>
            ) : (
              <>
                {logs.map((log, i) => (
                  <p
                    key={i}
                    className={`leading-relaxed break-all ${
                      log.includes("Processing complete") || log.includes("Done")
                        ? "text-workspace-accent font-bold"
                        : log.includes("Error") || log.includes("failed")
                        ? "text-red-300"
                        : "text-workspace-muted"
                    }`}
                  >
                    <span className="text-workspace-muted select-none">&gt; </span>
                    {log}
                  </p>
                ))}
                {(status === "converting" || status === "loading") && (
                  <p className="text-workspace-accent flex items-center gap-1">
                    <span className="text-workspace-muted select-none">&gt; </span>
                    <span className="inline-block w-2 h-3.5 bg-workspace-accent animate-cursor" />
                  </p>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopyLogs}
            className="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md px-2 text-sm text-workspace-muted hover:bg-workspace-control hover:text-workspace-accent"
            title="Copy logs"
          >
            {copied ? <Check className="h-3 w-3 text-workspace-accent" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "Copied" : "Copy log"}</span>
          </button>
        </div>
      </details>

      {status === "done" && resultUrl && (
        <div className="flex flex-wrap items-center gap-2 pt-2 animate-pop-in">
          <a
            href={resultUrl}
            download={resultFilename ?? "converted-file"}
            className="flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-workspace-accent px-4 text-center text-sm font-semibold text-workspace transition-colors hover:bg-workspace-accent-hover"
          >
            <Download className="h-4 w-4" />
            <span className="min-w-0 truncate">Download {resultFilename}</span>
          </a>
          <button
            type="button"
            onClick={onReset}
            className="min-h-11 cursor-pointer rounded-lg px-3 text-sm font-medium text-workspace-accent hover:bg-workspace-tint"
          >
            Convert another
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-2 pt-2 animate-pop-in">
          <p className="text-xs text-red-300 border border-red-900 p-2.5 rounded-lg bg-red-950/40">
            {error || "Conversion failed."}
          </p>
          <button
            type="button"
            onClick={onReset}
            className="w-full h-11 rounded-xl border border-workspace-line text-workspace-ink hover:border-workspace-accent hover:text-workspace-accent text-xs font-bold transition-all duration-200 cursor-pointer"
          >
            Choose different files
          </button>
        </div>
      )}
    </div>
  );
}
