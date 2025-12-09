import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod/v4";

/**
 * Validate `req.body` against a Zod schema.
 *
 * - Fails fast with HTTP 400 on validation error
 * - Attaches the parsed value to `req.validatedBody`
 * - Does NOT call `next` if validation fails
 */
export const validateBody = (schema: ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];

      return res.status(400).json({
        message: firstIssue?.message ?? "Invalid request body",
      });
    }

    // Attach validated value for downstream handlers
    (req as any).validatedBody = result.data;

    next();
  };

