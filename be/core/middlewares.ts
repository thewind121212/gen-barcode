import type { NextFunction, Request, Response } from "express";

import Session from "supertokens-node/recipe/session";

import type ErrorResponse from "@Ciri/interfaces/error-response";

import { env } from "@Ciri/env";

export type RequestContext = {
  userId: string;
};

type RequestWithContext = {
  context: RequestContext;
} & Request;

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

export async function handlerCheckToken(req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  try {
    const session = await Session.getSession(req, res, { sessionRequired: false });
    if (!session) {
      res.status(401).json({
        message: "Your Request Is Not Auth",
        stack: env.NODE_ENV === "production" ? "🥞" : undefined,
      });
      return; // Stop execution here
    }

    // Attach context for downstream handlers (can be extended later)
    (req as RequestWithContext).context = {
      userId: session.getUserId(),
    };

    // Session is valid, continue to next middleware
    next();
  }
  catch (error) {
    res.status(401).json({
      message: "Invalid or expired token",
      stack: env.NODE_ENV === "production" ? "🥞" : (error as Error).stack,
    });
  }
}

// Helper to read context in routes / controllers.
export function getContext(req: Request): RequestContext {
  return (req as RequestWithContext).context;
}

export async function errorHandler(err: Error, _req: Request, res: Response<ErrorResponse>, _next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}
