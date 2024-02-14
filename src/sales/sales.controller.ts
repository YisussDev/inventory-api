import { Controller, Get, Req, Headers, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Sale } from './sales.entity';

@Controller('sales')
export class SalesController {

  constructor(
    private salesService: SalesService
  ) { }

  @Get('')
  public getAll(@Req() req: any, @Headers() headers: any) {
    return this.salesService.findAll(req.query.page, headers);
  }

  @Post('create')
  async create(@Body() sale: Sale, @Headers() headers: any): Promise<Sale> {
    try {
      return await this.salesService.create(sale, headers);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
