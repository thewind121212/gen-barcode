import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { middleware } from "supertokens-node/framework/express";
import { errorHandler } from "supertokens-node/framework/express";

import api from "./api/index.js";
import * as middlewares from "./middlewares.js";


import type MessageResponse from "./interfaces/message-response.js";
import { env } from "./env.js";



import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import { overwrite } from "zod";


const recipeList = [Session.init()];

// if (env.DISABLE_REGISTER === "true") {
//   recipeList.push(
//     EmailPassword.init({
//       override: {
//         apis: (originalImplementation) => {
//           return {
//             ...originalImplementation,
//             signUpPOST: undefined,
//           }
//         }
//       }
//     })
//   );
// }



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
            }
          }
          return originalImplementation
        }
      }
    })
  ]
});



const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: env.WEBSITE_DOMAIN,
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  }),
);
app.use(express.json());
app.use(middleware())
app.use(errorHandler())

app.get<object, MessageResponse>("/ping", (req, res) => {
  res.json({
    message: "pong",
  });
});

app.use(middlewares.handlerCheckToken)
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.use("/api/v1", api);

export default app;
