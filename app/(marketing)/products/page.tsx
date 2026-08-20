import { MarketingHero } from "@/components/marketing/MarketingHero";
import { PRODUCT_MODULES } from "@/lib/marketing/products";

export const metadata = { title: "Products — SoloRec" };

export default function ProductsPage() {
  return (
    <div className="pb-16">
      <MarketingHero
        eyebrow="Products"
        title="Every stage of the desk, in one platform"
        subtitle="Source through revenue, plus the job intelligence and AI agents that connect them."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCT_MODULES.map((module) => {
          const Icon = module.icon;
          return (
            <div key={module.name} className="rounded-2xl border border-base-line bg-base-panel2 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue-soft">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-slate-50">{module.name}</h2>
              <p className="mt-2 text-sm text-slate-400">{module.tagline}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
