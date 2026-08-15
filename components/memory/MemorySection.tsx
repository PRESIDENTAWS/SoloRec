import type { MemoryCategory, MemoryItem } from "@/types";
import { Card, CardBody } from "@/components/ui/Card";

const CATEGORY_LABEL: Record<MemoryCategory, string> = {
  company: "Company Memory",
  client: "Client Memory",
  candidate: "Candidate Memory",
  market: "Market Memory",
  performance: "Performance Memory"
};

export function MemorySection({ category, items }: { category: MemoryCategory; items: MemoryItem[] }) {
  return (
    <Card>
      <CardBody>
        <h3 className="text-sm font-semibold text-slate-50">{CATEGORY_LABEL[category]}</h3>
        {items.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No memory recorded yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="rounded-xl border border-base-line bg-base-panel2 p-3">
                <p className="text-sm text-slate-300">{item.summary}</p>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                  <span>Source: {item.source}</span>
                  <span>Confidence: {Math.round(item.confidence * 100)}%</span>
                  <span>{item.embedding ? "Embedded" : "Not yet embedded"}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
