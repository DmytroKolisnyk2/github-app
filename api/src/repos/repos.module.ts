import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReposController } from './repos.controller';
import { ReposService } from './services/repos.service';
import { GithubService } from './services/github.service';
import { Repo } from './entities/repo.entity';
import { RepoOwner } from './entities/repo-owner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Repo, RepoOwner])],
  controllers: [ReposController],
  providers: [ReposService, GithubService],
})
export class ReposModule {}
