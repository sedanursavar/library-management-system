import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
} from 'typeorm';
import { Book } from '../books/book.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    // N Kategori ↔ N Kitap (İlişkinin diğer tarafı)
    @ManyToMany(() => Book, (book) => book.categories)
    books: Book[];
}
