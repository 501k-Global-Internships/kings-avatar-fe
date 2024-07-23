export interface ErrorResponse {
  message: string;
  errors?: { msg: string }[];
}