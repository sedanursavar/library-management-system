import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('authors')
export class AuthorsController {
    constructor(private authorsService: AuthorsService) {}

    @Get()
    findAll() {
        return this.authorsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.authorsService.findOne(+id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() createAuthorDto: CreateAuthorDto) {
        return this.authorsService.create(createAuthorDto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() updateData: Partial<CreateAuthorDto>) {
        return this.authorsService.update(+id, updateData);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.authorsService.remove(+id);
    }
}
