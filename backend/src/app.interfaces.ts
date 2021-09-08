
export interface ICurrency {
  ID: string;
  NumCode: string;
  CharCode: string;
  Nominal: number;
  Name: string;
  Value: number;
  Previous: number;
}

export interface ICurrencyResponse  {
  Date: string;
  PreviousDate: string;
  PreviousURL: string;
  Timestamp: string;
  Valute: { [key: string]: ICurrency };
}

export interface IRateRequest {
  to: string;
  from: string;
  amount: string;
}

export interface IRateResponse {
  amount: string;
}
