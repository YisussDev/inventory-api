import { Controller, Get, Patch, Post, Req, Headers, Body, Param, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('audits')
export class AuditController {

  constructor(
    private auditServices: AuditService
  ) { }

  @UseGuards(AuthGuard)
    @Get('')
    public getAll(@Req() req: any, @Headers() headers: any) {
        return this.auditServices.findAll(req.query.page, headers);
    }

}
