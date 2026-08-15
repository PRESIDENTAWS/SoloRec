const LEGEND: Array<{ label: string; color: string }> = [
  { label: "Working", color: "#3b82f6" },
  { label: "Review Required", color: "#8b5cf6" },
  { label: "Idle", color: "#94a3b8" },
  { label: "Blocked", color: "#f87171" }
];

export function OfficeLegend() {
  return (
    <ul className="flex flex-wrap items-center gap-4 px-5 py-3 text-xs text-slate-400">
      {LEGEND.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
