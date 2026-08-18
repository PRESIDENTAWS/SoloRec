"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getRequestContext } from "@/lib/auth/context";
import { createContact, updateContact } from "@/services/recruiting/contactService";
import { toActionError } from "@/lib/actions/toActionError";

export type ContactFormState = { error: string | null };

function formToInput(formData: FormData) {
  return {
    companyId: formData.get("companyId") || undefined,
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    title: formData.get("title"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    linkedinUrl: formData.get("linkedinUrl"),
    notes: formData.get("notes")
  };
}

export async function createContactAction(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const ctx = await getRequestContext();
  let contactId: string;
  try {
    const contact = await createContact(ctx, formToInput(formData));
    contactId = contact.id;
  } catch (err) {
    return { error: toActionError(err) };
  }
  revalidatePath("/contacts");
  redirect(`/contacts/${contactId}`);
}

export async function updateContactAction(
  id: string,
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const ctx = await getRequestContext();
  try {
    await updateContact(ctx, id, formToInput(formData));
  } catch (err) {
    return { error: toActionError(err) };
  }
  revalidatePath(`/contacts/${id}`);
  revalidatePath("/contacts");
  return { error: null };
}
