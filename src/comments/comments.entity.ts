import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { PostEntity } from '../posts/posts.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  comment: string; 

  @ManyToOne(() => User, user => user.comments, { onDelete: 'CASCADE' })
  user: User; 

  @ManyToOne(() => PostEntity, post => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: PostEntity; 

  @Column()
  postId: number; 

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

