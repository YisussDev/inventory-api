import { Controller, Get, Param, UseGuards, Headers, Req, Post, Body, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from './user.model';

@Controller('users')
export class UsersController {

    constructor(
        private userServices: UsersService
    ) { }

    @UseGuards(AuthGuard)
    @Get('')
    public getAll(@Req() req: any, @Headers() headers: any) {
        return this.userServices.findAll(req.query.page, headers);
    }

    @UseGuards(AuthGuard)
    @Post('create')
    public create(@Body() user: User, @Headers() headers: any) {
        return this.userServices.create(user);
    }

    @UseGuards(AuthGuard)
    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() user: User, @Headers() headers: any): Promise<{ data: User }> {
        return this.userServices.update(id, user);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteById(@Param('id') id: string, @Headers() headers: any): Promise<any> {
        return this.userServices.deleteById(id);
    }

}
