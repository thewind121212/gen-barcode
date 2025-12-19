import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import supertokens from "supertokens-node";
import { errorHandler, middleware } from "supertokens-node/framework/express";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";

import type MessageResponse from "@Ciri/core/interfaces/message-response";

import api from "@Ciri/core/api";
import { env } from "@Ciri/core/env";
import * as middlewares from "@Ciri/core/middlewares";
import { InitSentry } from "@Ciri/sentry/init";

supertokens.init({
  framework: "express",
  supertokens: {
    connectionURI: env.SUPERTOKENS_CONNECTION_URI,
  },
  appInfo: {
    appName: env.APP_NAME,
    apiDomain: env.API_DOMAIN,
    websiteDomain: env.WEBSITE_DOMAIN,
    apiBasePath: env.API_BASE_PATH,
    websiteBasePath: env.WEBSITE_BASE_PATH,
  },
  recipeList: [
    Session.init(),
    EmailPassword.init({
      override: {
        apis: (originalImplementation) => {
          if (env.DISABLE_REGISTER === "true") {
            return {
              ...originalImplementation,
              signUpPOST: undefined,
            };
          }
          return originalImplementation;
        },
      },
    }),
  ],
});

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: env.WEBSITE_DOMAIN,
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders(), "x-store-id"],
    credentials: true,
  }),
);

app.use(middleware());
app.use(errorHandler());

InitSentry();

app.get<object, MessageResponse>("/ping", (_req, res) => {
  res.json({
    message: "pong",
  });
});

// app.use(middlewares.handlerCheckToken)
app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
