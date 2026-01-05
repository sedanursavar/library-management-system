import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService) {}

    @Get()
    findAll() {
        return this.booksService.findAll();
    }

    @Get('search')
    search(@Query('q') query: string) {
        return this.booksService.search(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.booksService.findOne(+id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() createBookDto: CreateBookDto) {
        return this.booksService.create(createBookDto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() updateData: Partial<CreateBookDto>) {
        return this.booksService.update(+id, updateData);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.booksService.remove(+id);
    }
}
