import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { PostEntity } from '../posts/posts.entity';
import { Comment } from '../comments/comments.entity';
import { Like } from '../likes/likes.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number; // Primary key

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; 

  @Column()
  name: string; 

  @Column({ nullable: true })
  bio: string; 

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role; 

  @CreateDateColumn()
  createdAt: Date; 

  @OneToMany(() => PostEntity, post => post.author)
  posts: PostEntity[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, like => like.user)
  likes: Like[];
}
