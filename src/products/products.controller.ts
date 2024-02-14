import { Body, Controller, Get, Param, Patch, Post, Req, Headers, UseGuards, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './products.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('products')
export class ProductsController {

  constructor(
    private productService: ProductsService
  ) { }
  
  @UseGuards(AuthGuard)
  @Get('')
  public getAll(@Req() req: any, @Headers() headers: any) {
    return this.productService.findAll(req.query.page, headers);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  public create(@Body() product: Product, @Headers() headers: any): Promise<Product> {
    return this.productService.create(product, headers);
  }

  @UseGuards(AuthGuard)
  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() product: Product, @Headers() headers: any): Promise<{ data: Product }> {
    return this.productService.update(id, product, headers);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: string, @Headers() headers: any): Promise<any> {
    return this.productService.deleteById(id, headers);
  }

}
