import type { NextFunction, Request, Response } from "express";
import type { User } from "supertokens-node";

import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";

import type ErrorResponse from "@Ciri/core/interfaces/error-response";

import { guardStoreid } from "@Ciri/config";
import { getPrisma } from "@Ciri/core/prisma";
import { ErrorResponses } from "@Ciri/core/utils/error-response";

export type RequestContext = {
  userId: string;
  storeId?: string;
  userInfo?: User;
};

function extractStoreId(req: Request): string | undefined {
  // Prefer header (supports legacy alias)
  const fromHeader = req.header("x-store-id") || req.header("store-xiid");
  if (typeof fromHeader === "string" && fromHeader.trim()) {
    return fromHeader.trim();
  }

  const fromBody = typeof req.body?.storeId === "string" ? req.body.storeId : undefined;
  if (fromBody) {
    return fromBody;
  }

  const fromQuery = typeof req.query?.storeId === "string" ? req.query.storeId : undefined;
  if (fromQuery) {
    return fromQuery;
  }

  const fromParams = typeof req.params?.storeId === "string" ? req.params.storeId : undefined;
  return fromParams;
}

export function guardHaveStoreId(route: string): boolean {
  const topic = route.split("/")[1];
  if (guardStoreid.includes(topic)) {
    return true;
  }
  return false;
}

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
      ErrorResponses.unauthorized(res, "Your Request Is Not Auth");
      return; // Stop execution here
    }

    if (guardHaveStoreId(req.path)) {
      const storeId = extractStoreId(req);
      if (!storeId) {
        ErrorResponses.badRequest(res, "storeId is missing");
        return;
      }

      // Ensure the current user has access to this store
      const prisma = getPrisma();
      const member = await prisma.storeMember.findFirst({
        where: { storeId, userId: session.getUserId() },
      });
      if (!member) {
        ErrorResponses.forbidden(res, "You do not have access to this store");
        return;
      }
    }

    const userInfo = await supertokens.getUser(session.getUserId());
    if (!userInfo) {
      ErrorResponses.unauthorized(res, "Your Request Is Not Auth");
      return;
    }

    (req as RequestWithContext).context = {
      userId: session.getUserId(),
      userInfo,
      storeId: extractStoreId(req),
    };

    // Session is valid, continue to next middleware
    next();
  }
  catch (error) {
    ErrorResponses.unauthorized(res, (error as Error).message);
  }
}

// Helper to read context in routes / controllers.
export function getContext(req: Request): RequestContext {
  return (req as RequestWithContext).context;
}

export function getEmailFromContext(ctx: RequestContext): string {
  return ctx.userInfo?.emails?.[0] ?? "";
}

export async function errorHandler(err: Error, _req: Request, res: Response<ErrorResponse>, _next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  ErrorResponses.internalServerError(res, err.message);
}
