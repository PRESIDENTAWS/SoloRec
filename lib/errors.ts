/**
 * Standardized service errors. Domain services and Server Actions throw
 * these; route handlers/actions catch them and map to a safe client-facing
 * message — raw Postgres/Supabase errors never reach the browser (see
 * lib/actions/handleActionError.ts).
 */

export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class UnauthorizedError extends ServiceError {
  constructor(message = "You must be signed in to do that.") {
    super(message, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends ServiceError {
  constructor(message = "You don't have permission to do that.") {
    super(message, "FORBIDDEN");
  }
}

export class NotFoundError extends ServiceError {
  constructor(entity: string) {
    super(`${entity} not found.`, "NOT_FOUND");
  }
}

export class ValidationError extends ServiceError {
  constructor(message: string) {
    super(message, "VALIDATION");
  }
}

export class ConflictError extends ServiceError {
  constructor(message: string) {
    super(message, "CONFLICT");
  }
}
