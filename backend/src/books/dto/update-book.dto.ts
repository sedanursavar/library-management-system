import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  publishedYear?: number;

  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @IsOptional()
  @IsNumber()
  totalCopies?: number;

  @IsOptional()
  @IsNumber()
  authorId?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds?: number[];
}
