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
      className={`flex flex-col items-stretch gap-3 rounded-3xl border p-3 transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:p-2 ${
        isDragActive
          ? "border-workspace-accent bg-workspace-tint"
          : "border-workspace-line bg-workspace-panel hover:border-workspace-edge"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex min-h-11 items-center gap-3 px-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-workspace-control text-workspace-accent">
          <Upload className="size-4" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-workspace-muted">
          {isDragActive ? "Release to add your files" : "Drag and drop your files here"}
        </p>
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="min-h-11 shrink-0 cursor-pointer rounded-full bg-workspace-accent px-5 text-sm font-semibold text-workspace transition-colors duration-200 hover:bg-workspace-accent-hover"
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
