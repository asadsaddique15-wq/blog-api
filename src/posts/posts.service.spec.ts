import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostEntity } from './posts.entity';
import { UsersService } from '../users/users.service';

describe('PostsService', () => {
  let service: PostsService;

  const mockPostRepo = {};
  const mockUsersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService, 
        { provide: getRepositoryToken(PostEntity), useValue: mockPostRepo }, 
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
