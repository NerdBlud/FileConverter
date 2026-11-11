import { ArrowLeftRight, ShieldCheck } from "lucide-react";
import { useState, useCallback } from "react";
import { Dropzone } from "@/components/Dropzone";
import { ConversionPanel } from "@/components/ConversionPanel";
import { TerminalOverlay } from "@/components/TerminalOverlay";
import { useConverter } from "@/hooks/useConverter";
import type { ConversionTarget, ConversionOptions } from "@/lib/conversions";

export default function App() {
  const [files, setFiles] = useState<File[] | null>(null);
  const converter = useConverter();

  const handleFilesSelected = useCallback((selected: File[]) => {
    setFiles(selected);
  }, []);

  const handleConvert = useCallback(
    (files: File[], target: ConversionTarget, options?: ConversionOptions) => {
      converter.convert(files, target, options);
    },
    [converter]
  );

  const handleReset = useCallback(() => {
    setFiles(null);
    converter.reset();
  }, [converter]);

  const showTerminal =
    converter.status === "loading" ||
    converter.status === "converting" ||
    converter.status === "done" ||
    converter.status === "error";

  return (
    <div className="min-h-screen bg-workspace px-4 py-6 font-sans text-workspace-ink sm:px-8 sm:py-8">
      <div className="mx-auto flex max-w-6xl items-center gap-2.5 text-sm font-semibold tracking-tight">
        <span className="grid size-8 place-items-center rounded-xl border border-workspace-line bg-workspace-panel text-workspace-accent">
          <ArrowLeftRight className="size-4" aria-hidden="true" />
        </span>
        FileConverter
      </div>
      <main className="mx-auto w-full max-w-xl space-y-7 pt-16 pb-12 sm:pt-28">
        <header className="space-y-4 text-center">
          <h1 className="text-5xl leading-[0.98] font-bold tracking-[-0.065em] sm:text-7xl">Convert files</h1>
          <p className="text-sm leading-relaxed text-workspace-muted sm:text-base">
            Images, audio, video, and PDFs.
          </p>
        </header>
        {!files && <Dropzone onFilesSelected={handleFilesSelected} />}

        {files && !showTerminal && (
          <ConversionPanel
            files={files}
            onConvert={handleConvert}
            onReset={handleReset}
          />
        )}

        {showTerminal && (
          <TerminalOverlay
            status={converter.status}
            progress={converter.progress}
            logs={converter.logs}
            resultUrl={converter.resultUrl}
            resultFilename={converter.resultFilename}
            error={converter.error}
            elapsedMs={converter.elapsedMs}
            onReset={handleReset}
          />
        )}
        <p className="flex items-center justify-center gap-2 text-xs text-workspace-muted">
          <ShieldCheck className="size-4 shrink-0 text-workspace-muted" aria-hidden="true" />
          Files are processed on your device.
        </p>
      </main>
    </div>
  );
}
