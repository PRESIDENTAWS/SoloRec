import { signOut } from "@/app/(auth)/actions";

/** Plain form + server action — works without client JS (progressive enhancement). */
export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-xs font-medium text-slate-500 transition hover:text-slate-200"
      >
        Sign out
      </button>
    </form>
  );
}
