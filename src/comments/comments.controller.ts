import {Controller,Get,Post,Patch,Delete,Body,Param,ParseIntPipe,UseGuards,Req,} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  //do comment
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a comment (logged-in users only)' })
  create(@Body() dto: CreateCommentDto, @Req() req: any) {
    return this.commentsService.create(dto, req.user);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get a post with all comments under it' })
  async getCommentsByPost(@Param('postId', ParseIntPipe) postId: number) {
  return this.commentsService.getCommentsByPost(postId);
}

  //get by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment (owner or admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCommentDto, @Req() req: any) {
    return this.commentsService.update(id, dto, req.user);
  }

  //delete comment
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment (owner or admin)' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.commentsService.remove(id, req.user);
  }
}
