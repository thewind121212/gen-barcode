import type { NextFunction, Request, Response } from "express";
import type { ParsedQs } from "qs";
import type { ZodType } from "zod/v4";

import { ErrorResponses } from "@Ciri/core/utils/error-response";

type RequestWithValidatedBody<T> = {
  validatedBody: T;
} & Request;

export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return ErrorResponses.badRequest(res, firstIssue?.message ?? "Invalid request body");
    }

    // Attach validated value for downstream handlers
    (req as RequestWithValidatedBody<T>).validatedBody = result.data;

    next();
  };
}

export function getValidatedBody<T>(req: Request): T {
  return (req as RequestWithValidatedBody<T>).validatedBody;
}

type RequestWithValidatedQuery<T> = {
  validatedQuery: T;
} & Request;

function normalizeQueryValues(query: ParsedQs): ParsedQs {
  const normalize = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map(normalize);
    }
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, val]) => [key, normalize(val)]),
      );
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed !== "" && !Number.isNaN(Number(trimmed))) {
        return Number(trimmed);
      }
      return value;
    }
    return value;
  };

  return normalize(query) as ParsedQs;
}

export function validateQuery<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const normalizedQuery = normalizeQueryValues(req.query);
    const result = schema.safeParse(normalizedQuery);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return ErrorResponses.badRequest(res, firstIssue?.message ?? "Invalid query parameters");
    }

    (req as RequestWithValidatedQuery<T>).validatedQuery = result.data;
    next();
  };
}

export function getValidatedQuery<T>(req: Request): T {
  return (req as RequestWithValidatedQuery<T>).validatedQuery;
}
