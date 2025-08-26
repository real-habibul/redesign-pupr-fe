import "axios";

declare module "axios" {
  export interface AxiosError<T = unknown, D = any> {
    friendlyMessage?: string;
  }
}
