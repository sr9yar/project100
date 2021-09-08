import { Controller, Get, Req, Res, Query, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { IRateRequest, IRateResponse } from './app.interfaces';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Get currency codes
   * @returns 
   */
  @Get('codes')
  codes(@Res() res: Response): any {
    this.appService.getCodes().subscribe((codes) => {
      res.status(HttpStatus.OK).json(codes);
    });
  }

  /**
   * Get exchange rate
   * @returns 
   */
  @Get('rate')
  currencies(@Query() query: IRateRequest, @Res() res: Response, @Req() request: Request): any {
    this.appService.getRate(query).subscribe((codes) => {
      res.status(HttpStatus.OK).json(codes);
    });
  }
}
