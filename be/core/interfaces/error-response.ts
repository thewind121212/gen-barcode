import type MessageResponse from "@Ciri/core/interfaces/message-response";

type ErrorResponse = {
  stack?: string;
} & MessageResponse;
export default ErrorResponse;
