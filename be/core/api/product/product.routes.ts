import type { z } from "zod";

import express from "express";

import type { CreateProductResponse, ProductResponse } from "@Ciri/types/product";

import { createProductSchema } from "@Ciri/core/dto/product/create-product.dto";

import { getProductByIdSchema } from "@Ciri/core/dto/product/get-product-by-id.dto";
import { getContext } from "@Ciri/core/middlewares";
import { ProductService } from "@Ciri/core/services/product.service";
import { ErrorResponses, sendSuccessResponse } from "@Ciri/core/utils/error-response";
import { LogLevel, LogType, UnitLogger } from "@Ciri/core/utils/logger";
import { getValidatedBody, validateBody, getValidatedQuery, validateQuery } from "@Ciri/core/utils/validation";

const router = express.Router();
const productService = new ProductService();

export type CreateProductRequestBody = z.infer<typeof createProductSchema>;
export type CreateProductResponseServices = {
      resData: CreateProductResponse | null;
      error: string | null;
    };
export type GetProductByIdRequestQuery = z.infer<typeof getProductByIdSchema>;
export type GetProductByIdResponseServices = {
      resData: ProductResponse | null;
      error: string | null;
    };

router.post(
  "/CreateProduct",
  validateBody<CreateProductRequestBody>(createProductSchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedBody = getValidatedBody<CreateProductRequestBody>(req);
      const response = await productService.CreateProduct(ctx, validatedBody);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      if (!response.resData) {
        ErrorResponses.badRequest(res, "No response data");
        return;
      }
      sendSuccessResponse<CreateProductResponse>(res, 201, response.resData);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Product CreateProduct:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

router.get(
  "/GetProductById",
  validateQuery<GetProductByIdRequestQuery>(getProductByIdSchema),
  async (req, res, next): Promise<void> => {
    try {
      const ctx = getContext(req);
      const validatedQuery = getValidatedQuery<GetProductByIdRequestQuery>(req);
      const response = await productService.GetProductById(ctx, validatedQuery);
      if (response.error) {
        ErrorResponses.badRequest(res, response.error);
        return;
      }
      if (!response.resData) {
        ErrorResponses.badRequest(res, "No response data");
        return;
      }
      sendSuccessResponse<ProductResponse>(res, 200, response.resData);
    }
    catch (error) {
      UnitLogger(
        LogType.ROUTER,
        "Product GetProductById:",
        LogLevel.ERROR,
        (error as Error).message,
      );
      next(error);
    }
  },
);

export default router;
