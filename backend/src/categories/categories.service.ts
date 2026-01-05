import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) {}

    async findAll(): Promise<Category[]> {
        return this.categoriesRepository.find({ relations: ['books'] });
    }

    async findOne(id: number): Promise<Category> {
        const category = await this.categoriesRepository.findOne({
            where: { id },
            relations: ['books'],
        });
        if (!category) {
            throw new NotFoundException('Kategori bulunamadı');
        }
        return category;
    }

    async findByIds(ids: number[]): Promise<Category[]> {
        return this.categoriesRepository.findByIds(ids);
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = this.categoriesRepository.create(createCategoryDto);
        return this.categoriesRepository.save(category);
    }

    async update(id: number, updateData: Partial<CreateCategoryDto>): Promise<Category> {
        await this.findOne(id);
        await this.categoriesRepository.update(id, updateData);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const category = await this.findOne(id);
        await this.categoriesRepository.remove(category);
    }
}
