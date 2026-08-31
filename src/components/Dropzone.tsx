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
      className={`group relative cursor-pointer border-2 border-dashed rounded-2xl p-16 sm:p-24 flex flex-col items-center justify-center gap-5 transition-all duration-300 bg-black text-white select-none overflow-hidden ${
        isDragActive
          ? "border-yellow-400 text-yellow-400 bg-zinc-950 scale-[1.02] shadow-[0_0_30px_rgba(250,204,21,0.2)]"
          : "border-zinc-800 hover:border-yellow-400 hover:text-yellow-400 hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(250,204,21,0.12)]"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div
        className={`p-4 rounded-xl border border-zinc-900 bg-zinc-950 transition-all duration-300 group-hover:border-yellow-400 group-hover:bg-yellow-400/5 group-hover:scale-110 ${
          isDragActive ? "border-yellow-400 bg-yellow-400/10 scale-110" : ""
        }`}
      >
        <Upload
          className={`h-10 w-10 transition-transform duration-300 group-hover:scale-110 group-hover:text-yellow-400 ${
            isDragActive ? "text-yellow-400 scale-110" : "text-white"
          }`}
        />
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-mono font-bold tracking-widest uppercase transition-colors duration-200 group-hover:text-yellow-400">
          {isDragActive ? "DROP FILE" : "DROP FILE OR CLICK"}
        </p>
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
