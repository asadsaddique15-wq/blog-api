import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './comments.entity';
import { PostEntity } from '../posts/posts.entity';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
describe('CommentsService', () => {
  let service: CommentsService;
  const mockCommentRepo = {};
  const mockPostRepo = {};
  const mockPostsService = {};
  const mockUsersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getRepositoryToken(Comment), useValue: mockCommentRepo },
        { provide: getRepositoryToken(PostEntity), useValue: mockPostRepo },
        { provide: PostsService, useValue: mockPostsService }, 
        { provide: UsersService, useValue: mockUsersService }, 
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
