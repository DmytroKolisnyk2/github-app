import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ReposService } from './services/repos.service';
import { CreateRepoDto } from './dto/create-repo.dto';
import { Repo } from './entities/repo.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtUser } from 'src/auth/types/jwt-user.types';

@Controller('api/repos')
export class ReposController {
  private readonly logger = new Logger(ReposController.name);

  constructor(private readonly reposService: ReposService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@GetUser() user: JwtUser): Promise<Repo[]> {
    const userId = user.userId;
    this.logger.debug(`Finding repos for user: ${userId}`);
    return this.reposService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createRepoDto: CreateRepoDto,
    @GetUser() user: JwtUser,
  ): Promise<Repo> {
    this.logger.debug(`Creating repo for user: ${user.userId}`);
    return this.reposService.create(createRepoDto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/update')
  async update(
    @Param('id') id: string,
    @GetUser() user: JwtUser,
  ): Promise<Repo> {
    this.logger.debug(`Updating repo ${id} for user: ${user.userId}`);
    return this.reposService.update(parseInt(id, 10), user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @GetUser() user: JwtUser,
  ): Promise<void> {
    this.logger.debug(`Removing repo ${id} for user: ${user.userId}`);
    await this.reposService.remove(parseInt(id, 10), user.userId);
  }
}
