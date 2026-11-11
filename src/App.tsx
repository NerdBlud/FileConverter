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
    <div className="min-h-screen bg-[#f7f8fa] px-4 py-6 font-sans text-slate-950 sm:px-8 sm:py-8">
      <div className="mx-auto flex max-w-6xl items-center gap-2.5 text-sm font-semibold tracking-tight">
        <span className="grid size-8 place-items-center rounded-lg bg-slate-950 text-white">
          <ArrowLeftRight className="size-4" aria-hidden="true" />
        </span>
        FileConverter
      </div>
      <main className="mx-auto w-full max-w-xl space-y-6 pt-12 pb-10 sm:pt-20">
        <header className="space-y-3 text-center">
          <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Convert files</h1>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
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
        <p className="flex items-center justify-center gap-2 text-sm text-slate-600">
          <ShieldCheck className="size-4 shrink-0 text-slate-500" aria-hidden="true" />
          Files are processed on your device.
        </p>
      </main>
    </div>
  );
}
