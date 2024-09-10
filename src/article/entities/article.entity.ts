import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  blogContent: string;

  @Column({ length: 100 })
  userId: string;

  @Column()
  star: number;

  @Column()
  collect: number;
}
