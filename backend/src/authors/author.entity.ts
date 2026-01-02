import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { Book } from '../books/book.entity';

@Entity('authors')
export class Author {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @CreateDateColumn()
    createdAt: Date;

    // 1 Yazar → N Kitap
    @OneToMany(() => Book, (book) => book.author)
    books: Book[];
}
