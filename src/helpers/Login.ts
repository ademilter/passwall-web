export interface Login {
  ID: number;
  URL: string;
  Username: string;
  Password: string;
}

export interface LoginParamter {
  URL: string;
  Username: string;
  Password: string;
}

export interface SingInParameter {
  BaseURL: string;
  Username: string;
  Password: string;
}
export interface CheckPasswordResponse {
  URLs: string[];
}
