import { useRef, useEffect, useState } from "react";
import { Download, RotateCcw, Copy, Check, Clock } from "lucide-react";
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
      ? "LOADING"
      : status === "converting"
      ? `CONVERTING ${Math.round(progress * 100)}%`
      : status === "done"
      ? "DONE"
      : status === "error"
      ? "ERROR"
      : "READY";

  return (
    <div className="border border-zinc-800 rounded-2xl p-6 bg-black text-white space-y-4 font-mono shadow-2xl animate-pop-in">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`font-bold tracking-wider ${
              status === "done"
                ? "text-yellow-400"
                : status === "error"
                ? "text-red-400"
                : "text-white"
            }`}
          >
            {statusText}
          </span>
        </div>

        <div className="flex items-center gap-3 text-zinc-500">
          {(status === "converting" || status === "done") && (
            <span className="flex items-center gap-1 text-[11px] text-zinc-400">
              <Clock className="h-3 w-3 text-yellow-400" />
              {formattedTime}
            </span>
          )}

          <button
            type="button"
            onClick={handleCopyLogs}
            className="hover:text-yellow-400 flex items-center gap-1 transition-colors cursor-pointer"
            title="Copy logs"
          >
            {copied ? <Check className="h-3 w-3 text-yellow-400" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "COPIED" : "COPY"}</span>
          </button>
        </div>
      </div>

      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-yellow-400 h-full transition-all duration-200 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
          style={{ width: `${Math.max(progress * 100, status === "loading" ? 10 : 0)}%` }}
        />
      </div>

      <div
        ref={scrollRef}
        className="h-60 overflow-y-auto bg-zinc-950 border border-zinc-900 rounded-xl p-3.5 text-xs space-y-1.5 text-zinc-400"
      >
        {logs.length === 0 ? (
          <p className="text-zinc-600 flex items-center gap-1">
            <span>Running</span>
            <span className="inline-block w-1.5 h-3.5 bg-yellow-400 animate-cursor" />
          </p>
        ) : (
          <>
            {logs.map((log, i) => (
              <p
                key={i}
                className={`leading-relaxed break-all ${
                  log.includes("Processing complete") || log.includes("Done")
                    ? "text-yellow-400 font-bold"
                    : log.includes("Error") || log.includes("failed")
                    ? "text-red-400"
                    : "text-zinc-400"
                }`}
              >
                <span className="text-zinc-600 select-none">&gt; </span>
                {log}
              </p>
            ))}
            {(status === "converting" || status === "loading") && (
              <p className="text-yellow-400 flex items-center gap-1">
                <span className="text-zinc-600 select-none">&gt; </span>
                <span className="inline-block w-2 h-3.5 bg-yellow-400 animate-cursor" />
              </p>
            )}
          </>
        )}
      </div>

      {status === "done" && resultUrl && (
        <div className="flex gap-2 pt-2 animate-pop-in">
          <a
            href={resultUrl}
            download={resultFilename ?? "converted-file"}
            className="flex-1 h-12 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            DOWNLOAD {resultFilename}
          </a>
          <button
            type="button"
            onClick={onReset}
            className="h-12 px-5 rounded-xl border border-zinc-800 text-white hover:border-yellow-400 hover:text-yellow-400 text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-2 pt-2 animate-pop-in">
          <p className="text-xs text-red-400 border border-red-900/40 p-2.5 rounded-lg bg-red-950/20">
            {error || "Conversion failed."}
          </p>
          <button
            type="button"
            onClick={onReset}
            className="w-full h-11 rounded-xl border border-zinc-800 text-white hover:border-yellow-400 hover:text-yellow-400 text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95"
          >
            RETRY
          </button>
        </div>
      )}
    </div>
  );
}
