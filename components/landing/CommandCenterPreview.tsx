const KPIS = [
  { label: "Active Jobs", value: "42", delta: "+12%" },
  { label: "Placements", value: "18", delta: "+8%" },
  { label: "Revenue YTD", value: "$2.4M", delta: "+18%" },
  { label: "Pipeline Value", value: "$7.6M", delta: "+14%" }
];

const PIPELINE = [
  { label: "Intake", value: "24" },
  { label: "Sourcing", value: "68" },
  { label: "Screening", value: "35" },
  { label: "Interview", value: "21" },
  { label: "Offer", value: "7" }
];

const ACTIVITY = [
  { agent: "AVA", text: "Shortlisted 8 candidates for Senior DevOps Engineer", time: "2m ago", color: "bg-violet-500" },
  { agent: "NOVA", text: "Client update: ACME Corp opportunity score increased", time: "15m ago", color: "bg-sky-500" },
  { agent: "MILO", text: "Completed 5 candidate screens", time: "32m ago", color: "bg-emerald-500" },
  { agent: "LUNA", text: "Market insights updated", time: "1h ago", color: "bg-slate-400" }
];

const APPROVALS = [
  { title: "Offer Approval", sub: "DevOps Engineer", status: "Approved", time: "2m ago" },
  { title: "Rate Increase", sub: "Java Developer", status: "Approved", time: "18m ago" },
  { title: "New Job Intake", sub: "Security Architect", status: "Pending", time: "45m ago" },
  { title: "Contract Extension", sub: "Data Scientist", status: "Approved", time: "1h ago" }
];

/** Static marketing mock of the AI HQ command center (labeled illustrative). Not live data. */
export function CommandCenterPreview() {
  return (
    <div className="rounded-2xl border border-white/10 bg-base-panel/90 p-4 shadow-2xl shadow-black/40">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-100">AI HQ Command Center</span>
        <span className="rounded-md border border-white/10 px-2 py-0.5 text-[11px] text-slate-400">This Month</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-white/5 bg-base-panel2 p-2.5">
            <div className="text-[10px] text-slate-500">{kpi.label}</div>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-base font-bold text-slate-50">{kpi.value}</span>
              <span className="text-[10px] font-medium text-status-healthy">{kpi.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-white/5 bg-base-panel2 p-3">
        <div className="mb-2 text-[11px] font-medium text-slate-400">Pipeline Overview</div>
        <div className="grid grid-cols-5 gap-1.5">
          {PIPELINE.map((stage) => (
            <div key={stage.label} className="rounded-md bg-white/5 px-1.5 py-2 text-center">
              <div className="text-sm font-bold text-slate-100">{stage.value}</div>
              <div className="text-[9px] text-slate-500">{stage.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-white/5 bg-base-panel2 p-3">
          <div className="mb-2 text-[11px] font-medium text-slate-400">AI Agent Activity</div>
          <ul className="space-y-2">
            {ACTIVITY.map((item) => (
              <li key={item.agent} className="flex items-start gap-2">
                <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${item.color}`} aria-hidden="true" />
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-slate-200">{item.agent}</div>
                  <div className="truncate text-[10px] text-slate-500">{item.text}</div>
                </div>
                <span className="ml-auto shrink-0 text-[9px] text-slate-600">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-white/5 bg-base-panel2 p-3">
          <div className="mb-2 text-[11px] font-medium text-slate-400">Recent Approvals</div>
          <ul className="space-y-2">
            {APPROVALS.map((item) => (
              <li key={item.title} className="flex items-center gap-2">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-slate-200">{item.title}</div>
                  <div className="truncate text-[10px] text-slate-500">{item.sub}</div>
                </div>
                <span
                  className={`ml-auto shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium ${
                    item.status === "Pending"
                      ? "bg-status-review/15 text-status-review"
                      : "bg-status-healthy/15 text-status-healthy"
                  }`}
                >
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
