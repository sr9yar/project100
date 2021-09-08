import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { ICurrency, IRateRequest, IRateResponse } from './app.interfaces';
@Injectable()
export class AppService {

  constructor(private http: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Get currencies
   */
  getCurrencies(): Observable<{ [key: string]: ICurrency }> {
    return this.http.get<{ [key: string]: ICurrency }>('https://www.cbr-xml-daily.ru/daily_json.js')
      .pipe(map((res: AxiosResponse) => res.data.Valute));
  }

  /**
   * Calculate exchange rate 
   */
  getRate(query: IRateRequest): Observable<IRateResponse> {

    return this.getCurrencies()
      .pipe(map((currencies: { [key: string]: ICurrency }) => {
        let foreignCurrency: string;
        if(query.from !== 'RUB'){
          foreignCurrency = query.from;
        } else if(query.to !== 'RUB'){
          foreignCurrency = query.to;
        }

        if(!foreignCurrency || !currencies[foreignCurrency]){
          return { amount: '0' };
        }
        let currency: ICurrency = currencies[foreignCurrency];

        let requestedAmount: number;
        if (!Number.isNaN(Number(query.amount))) {
          requestedAmount = Number(query.amount);
        }

        return { amount: String(query.from === 'RUB' ? requestedAmount / currency.Value : requestedAmount * currency.Value ) };
      }));
  }

  /**
   * Get codes 
   */
  getCodes(): Observable<string[]> {
    return this.getCurrencies()
      .pipe(map((res: { [key: string]: ICurrency }) => Object.keys(res)));
  }
}
