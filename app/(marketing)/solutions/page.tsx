import { MarketingHero } from "@/components/marketing/MarketingHero";

export const metadata = { title: "Solutions — SoloRec" };

const SOLUTIONS = [
  { title: "Full-desk staffing agencies", body: "Run BD and delivery on one system — from hiring signal to placement and invoice." },
  { title: "Solo & boutique recruiters", body: "An AI workforce that makes one recruiter operate like a team." },
  { title: "Corporate talent acquisition", body: "In-house teams get sourcing, pipeline and analytics without the tool sprawl." },
  { title: "RPO & embedded teams", body: "Client portals and compliance make multi-account delivery transparent." }
];

export default function SolutionsPage() {
  return (
    <div className="pb-16">
      <MarketingHero
        eyebrow="Solutions"
        title="One operating system, many kinds of desks"
        subtitle="However you recruit, SoloRec adapts to the way your business bills."
      />
      <div className="mx-auto grid max-w-5xl gap-4 px-6 sm:grid-cols-2">
        {SOLUTIONS.map((solution) => (
          <div key={solution.title} className="rounded-2xl border border-base-line bg-base-panel2 p-6">
            <h2 className="text-lg font-semibold text-slate-50">{solution.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{solution.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
