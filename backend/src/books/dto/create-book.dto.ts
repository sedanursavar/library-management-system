import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer'; // 1. BU İMPORTU EKLE

export class CreateBookDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  isbn: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @Type(() => Number) // 2. Yıl için dönüşüm ekle
  @IsNumber()
  publishedYear?: number;

  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @IsOptional()
  @Type(() => Number) // 3. Kopya sayısı için dönüşüm ekle (Hatanın sebebi burası)
  @IsNumber()
  totalCopies?: number;

  @Type(() => Number) // 4. Yazar ID için dönüşüm ekle (Burası da hata verebilir)
  @IsNumber()
  authorId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];
}
