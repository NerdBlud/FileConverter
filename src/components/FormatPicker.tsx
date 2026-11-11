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
    <section aria-labelledby="output-format" className="space-y-4">
      <h2 id="output-format" className="text-sm font-semibold text-workspace-ink">Output format</h2>
      <div className="flex flex-wrap gap-2">
        {recommended.slice(0, 8).map((target) => {
          const isSelected = selected?.ext === target.ext;
          return (
            <button
              key={target.ext}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(target)}
              aria-pressed={isSelected}
              className={`min-h-9 px-3 rounded-full text-xs font-semibold uppercase border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-workspace-tint text-workspace-accent border-workspace-accent"
                  : "bg-workspace-control text-workspace-ink border-transparent hover:border-workspace-accent hover:text-workspace-accent"
              }`}
            >
              .{target.ext.toUpperCase()}
            </button>
          );
        })}
      </div>

      <details className="space-y-3">
        <summary className="w-fit cursor-pointer rounded-sm text-sm font-medium text-workspace-muted hover:text-workspace-ink">
          Browse all formats
        </summary>
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-workspace-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search formats"
              placeholder="Search formats"
              disabled={disabled}
              className="w-full bg-workspace-panel border border-workspace-line focus:border-workspace-accent rounded-full py-2.5 pr-4 pl-9 text-sm text-workspace-ink placeholder:text-workspace-muted transition-all duration-200"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={isActive}
                  disabled={disabled}
                  className={`min-h-9 px-2.5 rounded-full text-xs transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-workspace-control text-workspace-ink font-semibold"
                      : "text-workspace-muted hover:text-workspace-accent hover:bg-workspace-control"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto pr-1 rounded-xl border border-workspace-line bg-workspace p-2">
          {filteredFormats.length === 0 ? (
            <div className="py-6 text-center space-y-2 animate-pop-in">
              <p className="text-xs text-workspace-muted font-mono">No matching formats</p>
              <form onSubmit={handleCustomSubmit} className="flex max-w-xs mx-auto gap-2">
                <input
                  type="text"
                  aria-label="Custom file extension"
                  placeholder="Extension (e.g. m4v)"
                  value={customExt}
                  onChange={(e) => setCustomExt(e.target.value)}
                  className="min-w-0 flex-1 bg-workspace border border-workspace-line focus:border-workspace-accent rounded px-2.5 py-1 text-xs text-workspace-ink"
                />
                <button
                  type="submit"
                  className="bg-workspace-control hover:bg-workspace-edge text-workspace-ink px-3 py-1 rounded text-xs font-semibold transition-all duration-150"
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
                    aria-pressed={isSelected}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "border-workspace-accent bg-workspace-tint text-workspace-accent"
                        : "border-workspace-line bg-workspace-panel text-workspace-ink hover:border-workspace-accent hover:text-workspace-accent"
                    }`}
                  >
                    <span className="font-semibold text-xs">
                      .{target.ext.toUpperCase()}
                    </span>
                    {isSelected ? (
                      <Check className="h-3.5 w-3.5 text-workspace-accent" />
                    ) : (
                      <span className="text-xs text-workspace-muted font-mono">
                        {target.category.toUpperCase()}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </details>
    </section>
  );
}
