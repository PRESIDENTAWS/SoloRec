import Link from "next/link";
import { Users } from "lucide-react";
import { getRequestContext } from "@/lib/auth/context";
import { listCandidates } from "@/services/recruiting/candidateService";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/LinkButton";

export default async function CandidatesPage({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  const ctx = await getRequestContext();
  const candidates = await listCandidates(ctx, { search: searchParams.q });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
            Recruiting
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">Candidates</h1>
        </div>
        <LinkButton href="/candidates/new" variant="primary">
          + New Candidate
        </LinkButton>
      </div>

      <form className="max-w-sm">
        <input
          type="search"
          name="q"
          defaultValue={searchParams.q ?? ""}
          placeholder="Search name, title, company…"
          className="w-full rounded-lg border border-base-line bg-base-panel2 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-accent-blue-soft focus:outline-none focus:ring-1 focus:ring-accent-blue-soft"
        />
      </form>

      {candidates.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-14 text-center">
          <Users size={28} className="text-slate-600" aria-hidden="true" />
          <p className="text-sm text-slate-400">No candidates found.</p>
          <LinkButton href="/candidates/new" variant="secondary">
            Add your first candidate
          </LinkButton>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-base-line text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Current Role</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Experience</th>
                  <th className="px-4 py-3 font-medium">Skills</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-line">
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="text-slate-300">
                    <td className="px-5 py-3">
                      <Link
                        href={`/candidates/${candidate.id}`}
                        className="font-semibold text-slate-100 hover:text-accent-blue-soft"
                      >
                        {candidate.first_name} {candidate.last_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {candidate.current_title ?? "—"}
                      {candidate.current_company && <span className="text-slate-500"> · {candidate.current_company}</span>}
                    </td>
                    <td className="px-4 py-3">{candidate.location ?? "—"}</td>
                    <td className="px-4 py-3">{candidate.years_experience ? `${candidate.years_experience} yrs` : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-base-line bg-base-panel2 px-2 py-0.5 text-[11px] text-slate-400"
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className="text-[11px] text-slate-600">+{candidate.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
