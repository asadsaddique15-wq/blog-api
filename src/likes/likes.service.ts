import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './likes.entity';
import { User } from '../users/users.entity';
import { PostEntity } from '../posts/posts.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like) private likesRepo: Repository<Like>,
    @InjectRepository(PostEntity) private postsRepo: Repository<PostEntity>,
    private usersService: UsersService,
  ) {}

  async likePost(postId: number, user: any) {
  const fullUser = await this.usersService.findOne(user.id);
  const post = await this.postsRepo.findOne({ where: { id: postId } });
  if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);
  const existing = await this.likesRepo.findOne({
    where: { post: { id: postId }, user: { id: user.id } },
  });
  if (existing) throw new ForbiddenException('You have already liked this post');
  await this.likesRepo.save(this.likesRepo.create({ post, user: fullUser }));
  return {
    post: {
      id: post.id,
      title: post.title,
      content: post.content,
      status: 'liked',
    },
    user: {name: fullUser.name,},};
}

  async unlikePost(postId: number, user: User) {
    const like = await this.likesRepo.findOne({
      where: { post: { id: postId }, user: { id: user.id } },
      relations: ['post'],
    });
    if (!like) throw new NotFoundException('Like not found');
    await this.likesRepo.remove(like);
    return {
      message: `You unliked post with ID ${postId}`,
      post: { id: like.post.id, title: like.post.title },
    };
  }

  async findAllForPost(postId: number) {
    const post = await this.postsRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);
    
    const likes = await this.likesRepo.find({
      where: { post: { id: postId } },
      relations: ['user'],
    });
    const users = likes.map(like => ({name: like.user.name, }));
    return {
      post: {
        title: post.title,
        content: post.content,
        status: 'liked',
      },
      users: users,
      totalLikes: users.length,
    };
  }
}
