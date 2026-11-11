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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-8 sm:px-6 sm:py-16 font-sans">
      <main className="mx-auto w-full max-w-2xl space-y-8">
        <header className="space-y-4">
          <div className="grid size-12 place-items-center rounded-xl border border-yellow-400/20 bg-yellow-400/10 text-yellow-400">
            <ArrowLeftRight className="size-5" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">FileConverter</h1>
            <p className="max-w-prose text-sm leading-relaxed text-zinc-400 sm:text-base">
              Convert images, audio, video, and PDFs in your browser.
            </p>
          </div>
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
        <p className="flex items-center gap-2 text-sm text-zinc-400">
          <ShieldCheck className="size-4 shrink-0 text-yellow-400" aria-hidden="true" />
          Your files stay on this device.
        </p>
      </main>
    </div>
  );
}
