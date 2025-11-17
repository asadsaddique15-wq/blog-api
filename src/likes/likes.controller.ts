import { Controller, Post, Delete, Param, ParseIntPipe, UseGuards, Req, Get } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  //like
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  @ApiOperation({ summary: 'Like a post (logged-in users only)' })
  like(@Param('postId', ParseIntPipe) postId: number, @Req() req: any) {
    return this.likesService.likePost(postId, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  @ApiOperation({ summary: 'Unlike a post ' })
  unlike(@Param('postId', ParseIntPipe) postId: number, @Req() req: any) {
    return this.likesService.unlikePost(postId, req.user);
  }

  //get all likes for a post
  @Get(':postId')
  @ApiOperation({ summary: 'Get all likes for a post' })
  findAll(@Param('postId', ParseIntPipe) postId: number) {
    return this.likesService.findAllForPost(postId);
  }
}
