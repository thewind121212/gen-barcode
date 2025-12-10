import type MessageResponse from "@Ciri/interfaces/message-response";

type ErrorResponse = {
  stack?: string;
} & MessageResponse;
export default ErrorResponse;
