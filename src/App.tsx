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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <main className="w-full max-w-2xl mx-auto space-y-4">
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
      </main>
    </div>
  );
}
