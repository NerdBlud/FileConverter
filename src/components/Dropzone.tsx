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
    <div
      className={`flex min-h-72 flex-col items-center justify-center gap-5 rounded-2xl border border-dashed bg-white px-4 py-10 text-center transition-colors ${
        isDragActive ? "border-blue-600 bg-blue-50" : "border-slate-300"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <span className="grid size-12 place-items-center rounded-xl bg-slate-100 text-slate-700">
        <Upload className="size-5" aria-hidden="true" />
      </span>
      <p className="text-base font-medium">
        {isDragActive ? "Release to add your files" : "Drag and drop your files here"}
      </p>
      <button
        type="button"
        onClick={handleClick}
        className="min-h-11 cursor-pointer rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
      >
        Choose files
      </button>
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
