import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod/v4";
import { ErrorResponses } from "./errorResponse";

/**
 * Validate `req.body` against a Zod schema.
 *
 * - Fails fast with HTTP 400 on validation error
 * - Attaches the parsed value to `req.validatedBody`
 * - Does NOT call `next` if validation fails 
 */

interface RequestWithValidatedBody<T> extends Request {
  validatedBody: T;
}

export const validateBody = <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return ErrorResponses.badRequest(res, firstIssue?.message ?? "Invalid request body");
    }

    // Attach validated value for downstream handlers
    (req as RequestWithValidatedBody<T>).validatedBody = result.data;

    next();
  };


  export const getValidatedBody = <T>(req: Request): T =>
    (req as RequestWithValidatedBody<T>).validatedBody;

