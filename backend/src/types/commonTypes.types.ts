// Define a reusable type for standardized responses
export interface GenericResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  statusCode?: number;
}
