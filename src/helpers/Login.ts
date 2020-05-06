/* eslint-disable camelcase */
export interface Login {
  id: number;
  url: string;
  username: string;
  password: string;
  type?: string;
}
export interface BankAccount extends Login {
  bankName: string;
  bankCode: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  currency: string;
}
export interface Backup {
  name: string;
  created_at: string;
}

export interface LoginParamter {
  url: string;
  username: string;
  password: string;
}

export interface SingInParameter {
  base_url: string;
  username: string;
  password: string;
}
export interface CheckPasswordResponse {
  urls: string[];
}
