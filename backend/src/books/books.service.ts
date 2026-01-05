import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { Author } from '../authors/author.entity';
import { Category } from '../categories/category.entity';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private booksRepository: Repository<Book>,
        @InjectRepository(Author)
        private authorsRepository: Repository<Author>,
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) {}

    async findAll(): Promise<Book[]> {
        return this.booksRepository.find({
            relations: ['author', 'categories'],
        });
    }

    async findOne(id: number): Promise<Book> {
        const book = await this.booksRepository.findOne({
            where: { id },
            relations: ['author', 'categories'],
        });
        if (!book) {
            throw new NotFoundException('Kitap bulunamadı');
        }
        return book;
    }

    async create(createBookDto: CreateBookDto): Promise<Book> {
        const { authorId, categoryIds, ...bookData } = createBookDto;

        // Yazarı bul
        const author = await this.authorsRepository.findOne({ where: { id: authorId } });
        if (!author) {
            throw new NotFoundException('Yazar bulunamadı');
        }

        // Kategorileri bul
        const categories = await this.categoriesRepository.findByIds(categoryIds);
        if (categories.length !== categoryIds.length) {
            throw new NotFoundException('Bazı kategoriler bulunamadı');
        }

        // Kitabı oluştur
        const book = this.booksRepository.create({
            ...bookData,
            author,
            categories,
        });

        return this.booksRepository.save(book);
    }

    async update(id: number, updateData: Partial<CreateBookDto>): Promise<Book> {
        const book = await this.findOne(id);
        const { authorId, categoryIds, ...rest } = updateData;

        // Yazar güncelleme
        if (authorId) {
            const author = await this.authorsRepository.findOne({ where: { id: authorId } });
            if (!author) {
                throw new NotFoundException('Yazar bulunamadı');
            }
            book.author = author;
        }

        // Kategori güncelleme
        if (categoryIds) {
            const categories = await this.categoriesRepository.findByIds(categoryIds);
            book.categories = categories;
        }

        // Diğer alanları güncelle
        Object.assign(book, rest);

        return this.booksRepository.save(book);
    }

    async remove(id: number): Promise<void> {
        const book = await this.findOne(id);
        await this.booksRepository.remove(book);
    }

    async search(query: string): Promise<Book[]> {
        return this.booksRepository
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.author', 'author')
            .leftJoinAndSelect('book.categories', 'categories')
            .where('book.title ILIKE :query', { query: `%${query}%` })
            .orWhere('author.name ILIKE :query', { query: `%${query}%` })
            .getMany();
    }
}
