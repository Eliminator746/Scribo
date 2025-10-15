// Made the class generic (<T>) so it can hold any kind of data.
// Example: ApiResponse<User> or ApiResponse<Post[]>

export class ApiResponse<T> {
  status: number;
  data: T | null;
  message: string;

  constructor(status: number, data: T | null, message = "Success") {
    this.status = status;
    this.data = data;
    this.message = message;
  }
}
