import { Card, CardBody } from "@/components/ui/Card";
import { CandidateForm } from "@/components/recruiting/CandidateForm";
import { createCandidateAction } from "@/app/(app)/candidates/actions";

export default function NewCandidatePage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-blue-soft">
          Recruiting
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-50 sm:text-3xl">New Candidate</h1>
      </div>
      <div className="max-w-3xl">
        <Card>
          <CardBody>
            <CandidateForm action={createCandidateAction} submitLabel="Create candidate" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
