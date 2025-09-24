import { GenericResponse } from "../types/commonTypes.types";

// asyncHandler
export const asyncHandler = (fn: any) => {
  return async (req: any, res: any, next: any) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const genericResponse = <T = unknown>({
  success = false,
  message = "Operation failed",
  data = null,
  statusCode = 200,
}: {
  statusCode: number;
  success?: boolean;
  message?: string;
  data?: T | null;
}): GenericResponse<T> => ({
  statusCode,
  success,
  message,
  data,
});
