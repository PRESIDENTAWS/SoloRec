import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/auth/authorization";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { recordAuditLog } from "@/lib/audit/recordAuditLog";
import { contactInputSchema, type ContactInput } from "@/lib/validation/schemas";
import type { RequestContext } from "@/lib/auth/context";

export interface Contact {
  id: string;
  organization_id: string;
  company_id: string | null;
  first_name: string;
  last_name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

function toRow(input: ContactInput) {
  return {
    company_id: input.companyId || null,
    first_name: input.firstName,
    last_name: input.lastName,
    title: input.title || null,
    email: input.email || null,
    phone: input.phone || null,
    linkedin_url: input.linkedinUrl || null,
    notes: input.notes || null
  };
}

export async function listContacts(ctx: RequestContext, opts: { companyId?: string } = {}): Promise<Contact[]> {
  await requirePermission(ctx, "client:read");
  const supabase = createClient();
  let query = supabase.from("contacts").select("*").eq("organization_id", ctx.organizationId);
  if (opts.companyId) query = query.eq("company_id", opts.companyId);
  const { data, error } = await query.order("last_name");
  if (error) throw new Error(`Failed to list contacts: ${error.message}`);
  return data ?? [];
}

export async function getContact(ctx: RequestContext, id: string): Promise<Contact> {
  await requirePermission(ctx, "client:read");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("organization_id", ctx.organizationId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to load contact: ${error.message}`);
  if (!data) throw new NotFoundError("Contact");
  return data;
}

export async function createContact(ctx: RequestContext, rawInput: unknown): Promise<Contact> {
  await requirePermission(ctx, "client:create");
  const parsed = contactInputSchema.safeParse(rawInput);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("contacts")
    .insert({ ...toRow(parsed.data), organization_id: ctx.organizationId, created_by: ctx.userId })
    .select("*")
    .single();
  if (error || !data) throw new Error(`Failed to create contact: ${error?.message ?? "unknown error"}`);

  await recordAuditLog(ctx, {
    action: "contact.created",
    entityType: "contact",
    entityId: data.id,
    afterData: data
  });
  return data;
}

export async function updateContact(ctx: RequestContext, id: string, rawInput: unknown): Promise<Contact> {
  await requirePermission(ctx, "client:update");
  const parsed = contactInputSchema.safeParse(rawInput);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input");

  const before = await getContact(ctx, id);
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contacts")
    .update(toRow(parsed.data))
    .eq("organization_id", ctx.organizationId)
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) throw new Error(`Failed to update contact: ${error?.message ?? "unknown error"}`);

  await recordAuditLog(ctx, {
    action: "contact.updated",
    entityType: "contact",
    entityId: id,
    beforeData: before,
    afterData: data
  });
  return data;
}
