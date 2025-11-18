import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Like } from './likes.entity';
import { PostEntity } from '../posts/posts.entity';
import { UsersService } from '../users/users.service';

describe('LikesService', () => {
  let service: LikesService;

  const mockLikeRepo = {};
  const mockPostRepo = {};
  const mockUsersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        { provide: getRepositoryToken(Like), useValue: mockLikeRepo },
        { provide: getRepositoryToken(PostEntity), useValue: mockPostRepo },
        { provide: UsersService, useValue: mockUsersService }, 
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
