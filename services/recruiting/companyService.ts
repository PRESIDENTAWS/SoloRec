import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/auth/authorization";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { recordAuditLog } from "@/lib/audit/recordAuditLog";
import { companyInputSchema, type CompanyInput } from "@/lib/validation/schemas";
import type { RequestContext } from "@/lib/auth/context";

export interface Company {
  id: string;
  organization_id: string;
  name: string;
  website: string | null;
  industry: string | null;
  employee_count: number | null;
  headquarters: string | null;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

function toRow(input: CompanyInput) {
  return {
    name: input.name,
    website: input.website || null,
    industry: input.industry || null,
    employee_count: input.employeeCount ?? null,
    headquarters: input.headquarters || null,
    description: input.description || null
  };
}

export async function listCompanies(ctx: RequestContext): Promise<Company[]> {
  await requirePermission(ctx, "client:read");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("organization_id", ctx.organizationId)
    .order("name");
  if (error) throw new Error(`Failed to list companies: ${error.message}`);
  return data ?? [];
}

export async function getCompany(ctx: RequestContext, id: string): Promise<Company> {
  await requirePermission(ctx, "client:read");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("organization_id", ctx.organizationId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to load company: ${error.message}`);
  if (!data) throw new NotFoundError("Company");
  return data;
}

export async function createCompany(ctx: RequestContext, rawInput: unknown): Promise<Company> {
  await requirePermission(ctx, "client:create");
  const parsed = companyInputSchema.safeParse(rawInput);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("companies")
    .insert({ ...toRow(parsed.data), organization_id: ctx.organizationId, created_by: ctx.userId })
    .select("*")
    .single();
  if (error || !data) throw new Error(`Failed to create company: ${error?.message ?? "unknown error"}`);

  await recordAuditLog(ctx, {
    action: "company.created",
    entityType: "company",
    entityId: data.id,
    afterData: data
  });
  return data;
}

export async function updateCompany(ctx: RequestContext, id: string, rawInput: unknown): Promise<Company> {
  await requirePermission(ctx, "client:update");
  const parsed = companyInputSchema.safeParse(rawInput);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input");

  const before = await getCompany(ctx, id);
  const supabase = createClient();
  const { data, error } = await supabase
    .from("companies")
    .update(toRow(parsed.data))
    .eq("organization_id", ctx.organizationId)
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) throw new Error(`Failed to update company: ${error?.message ?? "unknown error"}`);

  await recordAuditLog(ctx, {
    action: "company.updated",
    entityType: "company",
    entityId: id,
    beforeData: before,
    afterData: data
  });
  return data;
}
