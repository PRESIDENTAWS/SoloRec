"use client";

import { useState, type FormEvent } from "react";
import type { AutonomyLevel } from "@/types";
import { AUTONOMY_LEVEL_LABELS } from "@/types";
import { MOCK_AGENTS } from "@/lib/agents/registry";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const AUTONOMY_LEVELS: AutonomyLevel[] = [0, 1, 2, 3, 4, 5];

const inputClass =
  "w-full rounded-lg border border-base-line bg-base-panel2 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-accent-blue-soft focus:outline-none focus:ring-1 focus:ring-accent-blue-soft";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500";

interface AgentDraft {
  name: string;
  department: string;
  role: string;
  reportsTo: string;
  autonomyLevel: AutonomyLevel;
  tools: string;
  knowledgeSources: string;
  permissions: string;
  kpis: string;
  escalationRules: string;
}

const EMPTY_DRAFT: AgentDraft = {
  name: "",
  department: "",
  role: "",
  reportsTo: "orion",
  autonomyLevel: 1,
  tools: "",
  knowledgeSources: "",
  permissions: "",
  kpis: "",
  escalationRules: ""
};

/**
 * Agent Builder. Submission is mock/local only — it does not call a
 * backend or persist beyond this page's state, per the starter's scope.
 * A real implementation would call AgentService.createAgent(...) against
 * the `agents` table design in docs/architecture/04-ai-and-agents.md.
 */
export function AgentBuilderForm() {
  const [draft, setDraft] = useState<AgentDraft>(EMPTY_DRAFT);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  function update<K extends keyof AgentDraft>(key: K, value: AgentDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmation(
      `"${draft.name || "Untitled agent"}" was created locally (mock only) — not persisted to a backend.`
    );
  }

  return (
    <Card>
      <CardBody>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="agent-name">
                Agent Name
              </label>
              <input
                id="agent-name"
                className={inputClass}
                value={draft.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. ATLAS"
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="agent-department">
                Department
              </label>
              <input
                id="agent-department"
                className={inputClass}
                value={draft.department}
                onChange={(e) => update("department", e.target.value)}
                placeholder="e.g. Talent Lab"
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="agent-role">
                Role
              </label>
              <input
                id="agent-role"
                className={inputClass}
                value={draft.role}
                onChange={(e) => update("role", e.target.value)}
                placeholder="e.g. Sourcing Agent"
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="agent-reports-to">
                Reports To
              </label>
              <select
                id="agent-reports-to"
                className={inputClass}
                value={draft.reportsTo}
                onChange={(e) => update("reportsTo", e.target.value)}
              >
                {MOCK_AGENTS.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="agent-autonomy">
              Autonomy Level
            </label>
            <select
              id="agent-autonomy"
              className={inputClass}
              value={draft.autonomyLevel}
              onChange={(e) => update("autonomyLevel", Number(e.target.value) as AutonomyLevel)}
            >
              {AUTONOMY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level} — {AUTONOMY_LEVEL_LABELS[level]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="agent-tools">
                Tools (comma-separated)
              </label>
              <textarea
                id="agent-tools"
                className={inputClass}
                rows={2}
                value={draft.tools}
                onChange={(e) => update("tools", e.target.value)}
                placeholder="search_candidates, draft_email"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="agent-knowledge">
                Knowledge Sources (comma-separated)
              </label>
              <textarea
                id="agent-knowledge"
                className={inputClass}
                rows={2}
                value={draft.knowledgeSources}
                onChange={(e) => update("knowledgeSources", e.target.value)}
                placeholder="Client DNA, Agency SOPs"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="agent-permissions">
                Permissions (comma-separated)
              </label>
              <textarea
                id="agent-permissions"
                className={inputClass}
                rows={2}
                value={draft.permissions}
                onChange={(e) => update("permissions", e.target.value)}
                placeholder="read:candidates, draft:outreach"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="agent-kpis">
                KPIs (comma-separated)
              </label>
              <textarea
                id="agent-kpis"
                className={inputClass}
                rows={2}
                value={draft.kpis}
                onChange={(e) => update("kpis", e.target.value)}
                placeholder="Qualified candidates, Response rate"
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="agent-escalation">
              Escalation Rules
            </label>
            <textarea
              id="agent-escalation"
              className={inputClass}
              rows={2}
              value={draft.escalationRules}
              onChange={(e) => update("escalationRules", e.target.value)}
              placeholder="Escalate to ORION if no client response after 5 business days"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary">
              Create Agent
            </Button>
            <Button type="button" variant="ghost" onClick={() => setDraft(EMPTY_DRAFT)}>
              Reset
            </Button>
          </div>

          {confirmation && (
            <p role="status" className="text-xs text-slate-500">
              {confirmation}
            </p>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
