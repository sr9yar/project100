import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, first } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  result: any;

  currencies: string[] = [];

  form: FormGroup;

  constructor(private http: HttpClient) {
    this.form = new FormGroup({
      from: new FormControl('RUB', Validators.required),
      to: new FormControl(null, Validators.required),
      amount: new FormControl(1, Validators.required),
    });

    this.getCurrencyCodes().subscribe((codes: string[]) => {
      this.currencies.splice(0, this.currencies.length, ...codes);
      this.currencies.unshift('RUB');
      this.form.get('to').setValue(codes[0], { emitEvent: false });
    });

    this.form.get('amount').valueChanges
      .pipe(
          debounceTime(300),
          distinctUntilChanged(),
        )
      .subscribe(() => {
        this.getRate().subscribe();
      });

      this.form.get('to').valueChanges
      .pipe(
          debounceTime(300),
          distinctUntilChanged(),
        )
      .subscribe(() => {
        this.getRate().subscribe();
      });

      this.form.get('from').valueChanges
      .pipe(
          debounceTime(300),
          distinctUntilChanged(),
        )
      .subscribe((newValue) => {
        if(newValue !== 'RUB'){
          this.form.get('to').setValue('RUB');
        }
        this.getRate().subscribe();
      });
  }

  /**
   * Get rate
   */
  getRate(): any {
    if (this.form.invalid) {
      return of(null).pipe(first());
    }
    if(this.form.get('to').value === this.form.get('from').value){
      return of({amount: 1}).pipe(first());
    }
    const params = Object.keys(this.form.value).reduce((a, c) => {
      a[c] = String(this.form.value[c]);
      return a;
    }, {});
    return this.http.get<any>('http://localhost:3000/rate', { params })
      .pipe(tap((res: any) => this.result = res.amount) );
  }

  /**
   * Get currencies
   */
  getCurrencyCodes(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3000/codes')
  }

  /**
   * select options
   */
  get toOptions(): string[] {
    return this.form.get('from').value === 'RUB' ? this.currencies : ['RUB'];
  }

  /**
   * select options
   */
  get fromOptions(): string[] {
    return this.currencies;
  }
}
