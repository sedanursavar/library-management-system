import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
    JoinColumn,
} from 'typeorm';
import { Author } from '../authors/author.entity';
import { Category } from '../categories/category.entity';

@Entity('books')
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ unique: true })
    isbn: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    publishedYear: number;

    @CreateDateColumn()
    createdAt: Date;

    // N Kitap → 1 Yazar
    @ManyToOne(() => Author, (author) => author.books, { eager: true })
    @JoinColumn({ name: 'authorId' })
    author: Author;

    @Column()
    authorId: number;

    // N Kitap ↔ N Kategori (Bu taraf "sahibi" - JoinTable burada)
    @ManyToMany(() => Category, (category) => category.books, { eager: true })
    @JoinTable({
        name: 'book_categories', // Ara tablo adı
        joinColumn: { name: 'bookId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
    })
    categories: Category[];
}
