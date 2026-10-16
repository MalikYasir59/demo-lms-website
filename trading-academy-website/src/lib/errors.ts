import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ERROR_CODES, HTTP_STATUS, ErrorCode } from "./constants";

export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = HTTP_STATUS.BAD_REQUEST,
    details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(message = "Bad request", details?: unknown) {
    return new ApiError(ERROR_CODES.VALIDATION_ERROR, message, HTTP_STATUS.BAD_REQUEST, details);
  }

  static unauthorized(message = "Authentication required", code: ErrorCode = ERROR_CODES.AUTH_REQUIRED) {
    return new ApiError(code, message, HTTP_STATUS.UNAUTHORIZED);
  }

  static forbidden(message = "Access forbidden", code: ErrorCode = ERROR_CODES.FORBIDDEN) {
    return new ApiError(code, message, HTTP_STATUS.FORBIDDEN);
  }

  static notFound(message = "Resource not found") {
    return new ApiError(ERROR_CODES.NOT_FOUND, message, HTTP_STATUS.NOT_FOUND);
  }

  static conflict(message = "Resource conflict", code: ErrorCode = ERROR_CODES.CONFLICT) {
    return new ApiError(code, message, HTTP_STATUS.CONFLICT);
  }

  static validation(details: unknown, message = "Validation failed") {
    return new ApiError(ERROR_CODES.VALIDATION_ERROR, message, HTTP_STATUS.UNPROCESSABLE_ENTITY, details);
  }

  static securityLocked(message = "Account locked for security reasons") {
    return new ApiError(ERROR_CODES.SECURITY_LOCKED, message, HTTP_STATUS.LOCKED);
  }

  static rateLimited(message = "Too many requests. Please try again later.") {
    return new ApiError(ERROR_CODES.RATE_LIMITED, message, HTTP_STATUS.TOO_MANY_REQUESTS);
  }

  static internal(message = "An unexpected internal error occurred") {
    return new ApiError(ERROR_CODES.INTERNAL_ERROR, message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

export function toErrorResponse(error: unknown): NextResponse {
  const headers = new Headers();
  headers.set("Cache-Control", "no-store, max-age=0");

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error.details !== undefined ? { details: error.details } : {}),
        },
      },
      {
        status: error.statusCode,
        headers,
      }
    );
  }

  if (error instanceof ZodError) {
    const rawIssues = (error as any).issues || (error as any).errors || [];
    const formattedErrors = (rawIssues as Array<{ path?: Array<string | number>; message?: string; code?: string }>).map((e) => ({
      path: Array.isArray(e.path) ? e.path.join(".") : "",
      message: e.message || "Invalid input",
      code: e.code,
    }));

    return NextResponse.json(
      {
        ok: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: "Validation failed",
          details: formattedErrors,
        },
      },
      {
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        headers,
      }
    );
  }

  console.error("[Unhandled API Error]:", error);

  return NextResponse.json(
    {
      ok: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: "An internal server error occurred",
      },
    },
    {
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      headers,
    }
  );
}
