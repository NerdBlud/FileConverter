import { useState, useEffect } from "react";
import { FormatPicker } from "@/components/FormatPicker";
import { ArrowRight, Sliders, ChevronDown, ChevronUp } from "lucide-react";
import {
  detectCategory,
  getSmartTargets,
  type ConversionTarget,
  type ConversionOptions,
} from "@/lib/conversions";

interface ConversionPanelProps {
  files: File[];
  onConvert: (files: File[], target: ConversionTarget, options?: ConversionOptions) => void;
  onReset: () => void;
  disabled?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function ConversionPanel({
  files,
  onConvert,
  onReset,
  disabled = false,
}: ConversionPanelProps) {
  const file = files[0];
  const { recommended, all } = getSmartTargets(file);
  const [selectedTarget, setSelectedTarget] = useState<ConversionTarget | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [audioBitrate, setAudioBitrate] = useState<"320k" | "192k" | "128k" | "lossless">("192k");
  const [videoScale, setVideoScale] = useState<"original" | "1080p" | "720p" | "480p">("original");
  const [gifFps, setGifFps] = useState<number>(12);

  useEffect(() => {
    if (recommended.length > 0) {
      setSelectedTarget(recommended[0]);
    } else if (all.length > 0) {
      setSelectedTarget(all[0]);
    }
  }, [file]);

  const handleConvert = () => {
    if (selectedTarget) {
      onConvert(files, selectedTarget, {
        audioBitrate,
        videoScale,
        gifFps,
      });
    }
  };

  const inputCategory = detectCategory(file);
  const usesAllFiles = selectedTarget?.ext === "pdf" && (inputCategory === "image" || inputCategory === "document");
  const isAudioTarget = selectedTarget?.category === "audio";
  const isVideoTarget = selectedTarget?.category === "video";
  const isGifTarget = selectedTarget?.ext === "gif";

  return (
    <div className="border border-zinc-800 rounded-2xl p-4 sm:p-6 bg-zinc-900 text-white space-y-6 animate-pop-in">
      <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold [overflow-wrap:anywhere]">{file.name}</p>
          <p className="text-sm text-zinc-400">{files.length === 1 ? formatFileSize(file.size) : `${files.length} files selected`}</p>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={disabled}
          className="shrink-0 rounded-md px-2 py-1 text-sm text-zinc-300 transition-colors hover:text-yellow-400 cursor-pointer"
        >
          Change files
        </button>
      </div>

      <FormatPicker
        recommended={recommended}
        all={all}
        selected={selectedTarget}
        onSelect={setSelectedTarget}
        disabled={disabled}
      />

      {files.length > 1 && selectedTarget && !usesAllFiles && (
        <p className="text-sm text-zinc-400">Only the first selected file will be converted to this format.</p>
      )}

      {(isAudioTarget || isVideoTarget || isGifTarget) && (
        <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950/60 transition-all duration-200">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            aria-expanded={showAdvanced}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-mono text-zinc-400 hover:text-yellow-400 transition-colors"
          >
            <span className="flex items-center gap-1.5 font-bold uppercase">
              <Sliders className="h-3.5 w-3.5" />
              OPTIONS
            </span>
            {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {showAdvanced && (
            <div className="p-4 border-t border-zinc-900 space-y-3 font-mono text-xs animate-pop-in">
              {isAudioTarget && (
                <div className="space-y-1.5">
                  <span className="text-zinc-500 block">BITRATE</span>
                  <div className="flex flex-wrap gap-2">
                    {(["128k", "192k", "320k", "lossless"] as const).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setAudioBitrate(b)}
                        aria-pressed={audioBitrate === b}
                        className={`px-3 py-1 rounded text-[11px] font-bold border uppercase transition-colors ${
                          audioBitrate === b
                            ? "bg-yellow-400 text-black border-yellow-400"
                            : "border-zinc-800 text-zinc-400 hover:border-yellow-400 hover:text-yellow-400"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isVideoTarget && (
                <div className="space-y-1.5">
                  <span className="text-zinc-500 block">RESOLUTION</span>
                  <div className="flex flex-wrap gap-2">
                    {(["original", "1080p", "720p", "480p"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setVideoScale(s)}
                        aria-pressed={videoScale === s}
                        className={`px-3 py-1 rounded text-[11px] font-bold border uppercase transition-colors ${
                          videoScale === s
                            ? "bg-yellow-400 text-black border-yellow-400"
                            : "border-zinc-800 text-zinc-400 hover:border-yellow-400 hover:text-yellow-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isGifTarget && (
                <div className="space-y-1.5">
                  <span className="text-zinc-500 block">FRAME RATE</span>
                  <div className="flex flex-wrap gap-2">
                    {([8, 12, 15, 24] as const).map((fps) => (
                      <button
                        key={fps}
                        type="button"
                        onClick={() => setGifFps(fps)}
                        aria-pressed={gifFps === fps}
                        className={`px-3 py-1 rounded text-[11px] font-bold border uppercase transition-colors ${
                          gifFps === fps
                            ? "bg-yellow-400 text-black border-yellow-400"
                            : "border-zinc-800 text-zinc-400 hover:border-yellow-400 hover:text-yellow-400"
                        }`}
                      >
                        {fps} FPS
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={handleConvert}
          disabled={disabled || !selectedTarget}
          className="flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 text-sm font-semibold text-zinc-950 transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {selectedTarget ? `Convert to ${selectedTarget.ext.toUpperCase()}` : "Choose an output format"}
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
