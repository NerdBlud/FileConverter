import { useCallback, useState, useRef } from "react";
import { Upload } from "lucide-react";

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
}

export function Dropzone({ onFilesSelected }: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        onFilesSelected(droppedFiles);
      }
    },
    [onFilesSelected]
  );

  const handleClick = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3 sm:p-4">
      <div
        className={`flex min-h-64 flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-4 py-8 text-center transition-colors ${
          isDragActive
            ? "border-yellow-400 bg-yellow-400/10"
            : "border-zinc-600 bg-zinc-950/60"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className="size-6 text-yellow-400" aria-hidden="true" />
        <p className="text-base font-medium">
          {isDragActive ? "Release to add your files" : "Drag and drop your files here"}
        </p>
        <button
          type="button"
          onClick={handleClick}
          className="min-h-11 cursor-pointer rounded-lg bg-yellow-400 px-5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-yellow-300"
        >
          Choose files
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        onChange={handleInputChange}
      />
    </div>
  );
}
