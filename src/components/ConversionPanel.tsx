import { useState, useEffect } from "react";
import { FormatPicker } from "@/components/FormatPicker";
import { ArrowRight, Sliders, ChevronDown } from "lucide-react";
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
    <div className="border border-workspace-line rounded-3xl p-4 sm:p-6 bg-workspace-panel text-workspace-ink space-y-6 animate-pop-in">
      <div className="flex items-start justify-between gap-3 border-b border-workspace-line pb-4">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold [overflow-wrap:anywhere]">{file.name}</p>
          <p className="text-sm text-workspace-muted">{files.length === 1 ? formatFileSize(file.size) : `${files.length} files selected`}</p>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={disabled}
          className="shrink-0 rounded-md px-2 py-1 text-sm text-workspace-muted transition-colors hover:text-workspace-accent cursor-pointer"
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
        <p className="text-sm text-workspace-muted">Only the first selected file will be converted to this format.</p>
      )}

      {(isAudioTarget || isVideoTarget || isGifTarget) && (
        <details
          className="disclosure rounded-2xl border border-workspace-line bg-workspace"
          open={showAdvanced}
          onToggle={(event) => setShowAdvanced(event.currentTarget.open)}
        >
          <summary className="disclosure-trigger px-4 py-3">
            <span className="flex items-center gap-2">
              <Sliders className="size-4" aria-hidden="true" />
              Options
            </span>
            <ChevronDown className="disclosure-chevron size-4" aria-hidden="true" />
          </summary>
          <div className="space-y-3 px-4 pb-4 text-xs">
            {isAudioTarget && (
              <div className="space-y-1.5">
                <span className="text-workspace-muted block">Bitrate</span>
                <div className="flex flex-wrap gap-2">
                  {(["128k", "192k", "320k", "lossless"] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setAudioBitrate(b)}
                      aria-pressed={audioBitrate === b}
                      className={`min-h-8 rounded-full px-3 text-xs font-bold border uppercase transition-colors ${
                        audioBitrate === b
                          ? "bg-workspace-accent text-workspace border-workspace-accent"
                          : "border-workspace-line text-workspace-muted hover:border-workspace-accent hover:text-workspace-accent"
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
                <span className="text-workspace-muted block">Resolution</span>
                <div className="flex flex-wrap gap-2">
                  {(["original", "1080p", "720p", "480p"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setVideoScale(s)}
                      aria-pressed={videoScale === s}
                      className={`min-h-8 rounded-full px-3 text-xs font-bold border uppercase transition-colors ${
                        videoScale === s
                          ? "bg-workspace-accent text-workspace border-workspace-accent"
                          : "border-workspace-line text-workspace-muted hover:border-workspace-accent hover:text-workspace-accent"
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
                <span className="text-workspace-muted block">Frame rate</span>
                <div className="flex flex-wrap gap-2">
                  {([8, 12, 15, 24] as const).map((fps) => (
                    <button
                      key={fps}
                      type="button"
                      onClick={() => setGifFps(fps)}
                      aria-pressed={gifFps === fps}
                      className={`min-h-8 rounded-full px-3 text-xs font-bold border uppercase transition-colors ${
                        gifFps === fps
                          ? "bg-workspace-accent text-workspace border-workspace-accent"
                          : "border-workspace-line text-workspace-muted hover:border-workspace-accent hover:text-workspace-accent"
                      }`}
                    >
                      {fps} FPS
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </details>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={handleConvert}
          disabled={disabled || !selectedTarget}
          className="flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-workspace-accent px-4 text-sm font-semibold text-workspace transition-colors hover:bg-workspace-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {selectedTarget ? `Convert to ${selectedTarget.ext.toUpperCase()}` : "Choose an output format"}
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
