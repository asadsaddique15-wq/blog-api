import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { PostEntity } from '../posts/posts.entity';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.likes, { onDelete: 'CASCADE' })
  user: User; 

  @ManyToOne(() => PostEntity, post => post.likes, { onDelete: 'CASCADE' })
  post: PostEntity; 

  @CreateDateColumn()
  createdAt: Date;
}
