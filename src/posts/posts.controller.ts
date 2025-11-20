import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, Req, ForbiddenException, }
  from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/users.entity';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('posts') // Swagger group
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all posts with  status' })
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: any) {
    const user = req.user || null;
    return this.postsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'only logged in user can create a post' })
  create(@Body() dto: CreatePostDto, @Req() req: any) {
    return this.postsService.create(dto, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID (shows like status if logged in)' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const user = req.user || null;
    return this.postsService.findOne(id, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update post (owner or admin)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
    @Req() req: any,
  ) {
    return this.postsService.update(id, dto, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete post (admin or owner)' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.postsService.remove(id, req.user);
  }
}
