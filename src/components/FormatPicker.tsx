import { useState, useMemo } from "react";
import {
  type ConversionTarget,
  type TargetCategory,
  ALL_TARGETS,
} from "@/lib/conversions";
import { Search, Check } from "lucide-react";

interface FormatPickerProps {
  recommended: ConversionTarget[];
  all: ConversionTarget[];
  selected: ConversionTarget | null;
  onSelect: (target: ConversionTarget) => void;
  disabled?: boolean;
}

const CATEGORY_TABS: { id: "all" | TargetCategory; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "audio", label: "AUDIO" },
  { id: "video", label: "VIDEO" },
  { id: "image", label: "IMAGE" },
  { id: "animation", label: "ANIMATED" },
  { id: "document", label: "DOCUMENT" },
];

export function FormatPicker({
  recommended,
  all,
  selected,
  onSelect,
  disabled = false,
}: FormatPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | TargetCategory>("all");
  const [customExt, setCustomExt] = useState("");

  const filteredFormats = useMemo(() => {
    let list = all;

    if (activeTab !== "all") {
      list = all.filter((t) => t.category === activeTab);
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (t) =>
        t.ext.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.label.toLowerCase().includes(q)
    );
  }, [all, activeTab, searchQuery]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanExt = customExt.trim().replace(/^\./, "").toLowerCase();
    if (!cleanExt) return;

    if (ALL_TARGETS[cleanExt]) {
      onSelect(ALL_TARGETS[cleanExt]);
    } else {
      onSelect({
        ext: cleanExt,
        label: cleanExt.toUpperCase(),
        name: cleanExt.toUpperCase(),
        category: "video",
        mimeType: "application/octet-stream",
        description: "",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {recommended.slice(0, 8).map((target) => {
          const isSelected = selected?.ext === target.ext;
          return (
            <button
              key={target.ext}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(target)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-yellow-400 text-black border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)] scale-[1.02]"
                  : "bg-black text-white border-zinc-800 hover:border-yellow-400 hover:text-yellow-400 hover:scale-105 active:scale-95"
              }`}
            >
              .{target.ext.toUpperCase()}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search format..."
            disabled={disabled}
            className="w-full bg-black border border-zinc-800 focus:border-yellow-400 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none transition-all duration-200 focus:shadow-[0_0_15px_rgba(250,204,21,0.15)]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                disabled={disabled}
                className={`px-2.5 py-1 rounded text-[11px] font-mono tracking-wider transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-white text-black font-bold scale-105 shadow-sm"
                    : "text-zinc-400 hover:text-yellow-400 hover:bg-zinc-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto pr-1 rounded-xl border border-zinc-800 bg-black p-2">
        {filteredFormats.length === 0 ? (
          <div className="py-6 text-center space-y-2 animate-pop-in">
            <p className="text-xs text-zinc-500 font-mono">Custom format:</p>
            <form onSubmit={handleCustomSubmit} className="flex max-w-xs mx-auto gap-2">
              <input
                type="text"
                placeholder="Extension (e.g. m4v)"
                value={customExt}
                onChange={(e) => setCustomExt(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-yellow-400 rounded px-2.5 py-1 text-xs font-mono text-white focus:outline-none"
              />
              <button
                type="submit"
                className="bg-white hover:bg-yellow-400 hover:text-black text-black px-3 py-1 rounded text-xs font-bold font-mono transition-all duration-150"
              >
                SELECT
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {filteredFormats.map((target) => {
              const isSelected = selected?.ext === target.ext;
              return (
                <button
                  key={target.ext}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelect(target)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "border-yellow-400 bg-yellow-400/10 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.15)] scale-[1.01]"
                      : "border-zinc-900 bg-black text-white hover:border-yellow-400 hover:text-yellow-400 hover:scale-[1.02] active:scale-98"
                  }`}
                >
                  <span className="font-mono font-bold text-xs">
                    .{target.ext.toUpperCase()}
                  </span>
                  {isSelected ? (
                    <Check className="h-3.5 w-3.5 text-yellow-400" />
                  ) : (
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {target.category.toUpperCase()}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
