import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Note {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    body!: string;
    
    // Relación muchos a uno
    @ManyToOne(() => User, user => user.notes)
    creator!: User;
}
