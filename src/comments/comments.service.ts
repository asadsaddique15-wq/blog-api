import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/users.entity';
import { PostEntity } from '../posts/posts.entity';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepo: Repository<Comment>,
    @InjectRepository(PostEntity) private postsRepo: Repository<PostEntity>,
    private postsService: PostsService,
    private usersService: UsersService,
  ) {}

 async create(dto: CreateCommentDto, user: any) {
  const fullUser = await this.usersService.findOne(user.id);  
  const post = await this.postsRepo.findOne({ where: { id: dto.postId } });
  if (!post) throw new NotFoundException(`Post with ID ${dto.postId} not found`);
  const comment = this.commentsRepo.create({
    comment: dto.comment,
    user: fullUser,
    post: post, 
    postId: dto.postId,
  });
  const savedComment = await this.commentsRepo.save(comment);
  return {
    post: {
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    },
    user: {name: fullUser.name,role: fullUser.role,bio: fullUser.bio,},
    comment: {id: savedComment.id, comment: savedComment.comment,
      createdAt: savedComment.createdAt,
      updatedAt: savedComment.updatedAt,},
  };
}

async getCommentsByPost(postId: number) {
    const post = await this.postsRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);
    const comments = await this.commentsRepo.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
    const formattedComments = comments.map(c => ({
      user: {name: c.user.name,role: c.user.role,},
      id: c.id,
      comment: c.comment,
      createdAt: c.createdAt,
    }));
    return {
      post: {title: post.title,content: post.content,createdAt: post.createdAt,updatedAt: post.updatedAt,},
      comments: formattedComments,
    };
  }

  async findOne(id: number): Promise<any> {
    const comment = await this.commentsRepo.findOne({
      where: { id },
      relations: ['user', 'post'],
    });
    if (!comment) throw new NotFoundException('Comment not found');
    return {
      post: {title: comment.post.title,content: comment.post.content,},
      user: {name: comment.user.name,
      },
      id: comment.id,
      comment: comment.comment,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

 async update(id: number, dto: UpdateCommentDto, currentUser: User) {
  const comment = await this.commentsRepo.findOne({
    where: { id },
    relations: ['user', 'post'],
  });
  if (!comment) throw new NotFoundException('Comment not found');

  // Only owner or admin can update
  if (comment.user.id !== currentUser.id && currentUser.role !== 'admin') {
    throw new ForbiddenException('You cannot update this comment');
  }

  Object.assign(comment, dto);
  const updatedComment = await this.commentsRepo.save(comment);
  return {
    post: {title: updatedComment.post.title,content: updatedComment.post.content,createdAt: 
      updatedComment.post.createdAt,
      updatedAt: updatedComment.post.updatedAt,
    },
    user: {name: updatedComment.user.name,role: updatedComment.user.role,},
    id: updatedComment.id,
    comment: updatedComment.comment,
    createdAt: updatedComment.createdAt,
    updatedAt: updatedComment.updatedAt,
  };
  }
  //del
  async remove(id: number, currentUser: User): Promise<{ message: string }> {
    const comment = await this.commentsRepo.findOne({
      where: { id },
      relations: ['user', 'post'],
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user.id !== currentUser.id && currentUser.role !== 'admin') {
      throw new ForbiddenException('You cannot delete this comment');
    }
    await this.commentsRepo.remove(comment);
    return { message: `Comment with ID ${id} deleted successfully` };
  }
}
