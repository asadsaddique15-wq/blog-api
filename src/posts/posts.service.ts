import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User, Role } from '../users/users.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
 constructor(@InjectRepository(PostEntity) private postsRepo: Repository<PostEntity>
 ,private usersService: UsersService,) {}

async create(dto: CreatePostDto, user: User) {
    const post = this.postsRepo.create({ ...dto, author: user });
    const savedPost = await this.postsRepo.save(post);
    return {
      author: {name: user.name, role: user.role,},
      id: savedPost.id,
      title: savedPost.title,
      content: savedPost.content,
      createdAt: savedPost.createdAt,
      updatedAt: savedPost.updatedAt,
      status: '',
    };
  }

 async findAll(user?: User): Promise<any[]> {
  try {
    const posts = await this.postsRepo.find({
      relations: ['author', 'likes', 'likes.user'],
      order: { createdAt: 'DESC' },
    });
    const postsWithAuthor = posts.filter(p => p.author != null);
    const missingAuthors = posts.length - postsWithAuthor.length;
    if (missingAuthors > 0) {
      console.warn(`PostsService.findAll: skipped ${missingAuthors} posts with null author`);
    }
   return posts.map(post => {
  const liked = user ? post.likes?.some(like => like.user?.id === user.id) : false;

  return {
    author: post.author
      ? { name: post.author.name, role: post.author.role }
      : { name: 'Unknown', role: 'N/A' }, // fallback
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    status: liked ? 'liked' : '',
  };
});
  } catch (err) {
    console.error('Error in PostsService.findAll:', err);
    throw new InternalServerErrorException('Unable to fetch posts');
  }
}
 

  async getRawPost(id: number): Promise<PostEntity> {
    const post = await this.postsRepo.findOne({ where: { id }, relations: ['author'] });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

async findOne(id: number, user?: User): Promise<any> {
  try {
    const post = await this.postsRepo.findOne({ where: { id }, relations: ['author', 'likes', 'likes.user'] });
    if (!post) throw new NotFoundException('Post not found');
    const likes = post.likes || [];
    const liked = user ? likes.some(like => like.user?.id === user.id) : false;
    return {
      author: { name: post.author?.name || 'Unknown', role: post.author?.role || Role.USER },
      post: { id: post.id, title: post.title, content: post.content, createdAt: post.createdAt, updatedAt: post.updatedAt, status: liked ? 'liked' : '' },
    };
  } catch (err) {
    console.error(`Error in PostsService.findOne (id=${id}):`, err);
    if (err instanceof NotFoundException) throw err;
    throw new InternalServerErrorException('Unable to fetch post');
  }
}

  async update(id: number, dto: UpdatePostDto, currentUser: User): Promise<PostEntity> {
    const post = await this.getRawPost(id);
    if (post.author.id !== currentUser.id && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('You cannot update this post');
    }
    Object.assign(post, dto);
    return this.postsRepo.save(post);
  }

  async remove(id: number, currentUser: User): Promise<{ message: string }> {
    const post = await this.getRawPost(id);
    if (post.author.id !== currentUser.id && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('You cannot delete this post');
    }
    await this.postsRepo.remove(post);
    return { message: `Post with ID ${id} deleted successfully` };
  }
}
