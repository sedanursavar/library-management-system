import { IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateBookDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    isbn: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    @IsNumber()
    publishedYear?: number;

    @IsNumber()
    authorId: number;

    @IsArray()
    @IsNumber({}, { each: true })
    categoryIds: number[];
}
