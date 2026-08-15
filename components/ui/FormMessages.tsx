export function FormError({ message }: { message: string | null | undefined }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-status-blocked/30 bg-status-blocked/10 px-3 py-2 text-sm text-status-blocked"
    >
      {message}
    </p>
  );
}

export function FormInfo({ message }: { message: string | null | undefined }) {
  if (!message) return null;
  return (
    <p
      role="status"
      className="rounded-lg border border-status-healthy/30 bg-status-healthy/10 px-3 py-2 text-sm text-status-healthy"
    >
      {message}
    </p>
  );
}
