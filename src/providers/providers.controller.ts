import { Controller, Get, Req, Headers, Body, Param, Post, Patch, UseGuards, Delete } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { Provider } from './providers.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('providers')
export class ProvidersController {

  constructor(
    private providerService: ProvidersService
  ) { }

  @UseGuards(AuthGuard)
  @Get('')
  public getAll(@Req() req: any, @Headers() headers: any) {
    return this.providerService.findAll(req.query.page, headers);
  }

  @UseGuards(AuthGuard)
  @Get('list')
  public list(@Req() req: any, @Headers() headers: any) {
    return this.providerService.list();
  }

  @UseGuards(AuthGuard)
  @Post('create')
  public create(@Body() provider: Provider, @Headers() headers: any): Promise<Provider> {
    return this.providerService.create(provider, headers);
  }

  @UseGuards(AuthGuard)
  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() provider: Provider, @Headers() headers: any): Promise<{ data: Provider }> {
    return this.providerService.update(id, provider, headers);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: string, @Headers() headers: any): Promise<any> {
    return this.providerService.deleteById(id, headers);
  }

}
