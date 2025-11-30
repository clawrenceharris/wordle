export interface AppError {
  code: string;
  userMessage: string;
  status?: number;
  cause?: unknown;
}
