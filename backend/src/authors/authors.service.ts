import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';

@Injectable()
export class AuthorsService {
    constructor(
        @InjectRepository(Author)
        private authorsRepository: Repository<Author>,
    ) {}

    async findAll(): Promise<Author[]> {
        return this.authorsRepository.find({ relations: ['books'] });
    }

    async findOne(id: number): Promise<Author> {
        const author = await this.authorsRepository.findOne({
            where: { id },
            relations: ['books'],
        });
        if (!author) {
            throw new NotFoundException('Yazar bulunamadı');
        }
        return author;
    }

    async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
        const author = this.authorsRepository.create(createAuthorDto);
        return this.authorsRepository.save(author);
    }

    async update(id: number, updateData: Partial<CreateAuthorDto>): Promise<Author> {
        await this.findOne(id);
        await this.authorsRepository.update(id, updateData);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const author = await this.findOne(id);
        await this.authorsRepository.remove(author);
    }
}
