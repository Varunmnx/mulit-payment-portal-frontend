export class ApiResponse<T> {
  status: "SUCCESS" | "NOT_SUCCESS";
  result:T;
  statusCode:number;
  error?: string;
  constructor(status: "SUCCESS" | "NOT_SUCCESS", result:T, statusCode:number, error?: string) {
    this.status = status;
    this.result = result;
    this.statusCode = statusCode;
    this.error = error;
  }
}