"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getRequestContext } from "@/lib/auth/context";
import { createCompany, updateCompany } from "@/services/recruiting/companyService";
import { toActionError } from "@/lib/actions/toActionError";

export type CompanyFormState = { error: string | null };

function formToInput(formData: FormData) {
  return {
    name: formData.get("name"),
    website: formData.get("website"),
    industry: formData.get("industry"),
    employeeCount: formData.get("employeeCount") || undefined,
    headquarters: formData.get("headquarters"),
    description: formData.get("description")
  };
}

export async function createCompanyAction(
  _prevState: CompanyFormState,
  formData: FormData
): Promise<CompanyFormState> {
  const ctx = await getRequestContext();
  let companyId: string;
  try {
    const company = await createCompany(ctx, formToInput(formData));
    companyId = company.id;
  } catch (err) {
    return { error: toActionError(err) };
  }
  revalidatePath("/companies");
  redirect(`/companies/${companyId}`);
}

export async function updateCompanyAction(
  id: string,
  _prevState: CompanyFormState,
  formData: FormData
): Promise<CompanyFormState> {
  const ctx = await getRequestContext();
  try {
    await updateCompany(ctx, id, formToInput(formData));
  } catch (err) {
    return { error: toActionError(err) };
  }
  revalidatePath(`/companies/${id}`);
  revalidatePath("/companies");
  return { error: null };
}
