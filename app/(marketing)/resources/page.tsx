import { MarketingHero } from "@/components/marketing/MarketingHero";

export const metadata = { title: "Resources — SoloRec" };

const RESOURCES = [
  { title: "Guides", body: "Playbooks for building a full-desk staffing business on SoloRec." },
  { title: "Product updates", body: "What's new across the operating system and the AI workforce." },
  { title: "Help center", body: "Documentation for recruiters, clients and candidates." }
];

export default function ResourcesPage() {
  return (
    <div className="pb-16">
      <MarketingHero
        eyebrow="Resources"
        title="Learn how the best desks operate"
        subtitle="Guides, product updates and documentation — coming soon."
      />
      <div className="mx-auto grid max-w-5xl gap-4 px-6 sm:grid-cols-3">
        {RESOURCES.map((resource) => (
          <div key={resource.title} className="rounded-2xl border border-base-line bg-base-panel2 p-6">
            <h2 className="text-base font-semibold text-slate-50">{resource.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{resource.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
