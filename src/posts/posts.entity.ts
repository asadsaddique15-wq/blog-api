import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Like } from '../likes/likes.entity';
import { Comment } from '../comments/comments.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  //many posts belong to one user
  @ManyToOne(() => User, user => user.posts, { onDelete: 'CASCADE' })
  author: User; 

  //one post can have many likes
  @OneToMany(() => Like, like => like.post)
  likes: Like[];

  //one post can have many comments
  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

