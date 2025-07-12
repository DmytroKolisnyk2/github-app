import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Repo } from '../entities/repo.entity';
import { RepoOwner } from '../entities/repo-owner.entity';
import { GithubService } from './github.service';
import { CreateRepoDto } from '../dto/create-repo.dto';

@Injectable()
export class ReposService {
  constructor(
    @InjectRepository(Repo)
    private readonly reposRepository: Repository<Repo>,
    @InjectRepository(RepoOwner)
    private readonly repoOwnersRepository: Repository<RepoOwner>,
    private readonly githubService: GithubService,
  ) {}

  async findAll(userId?: string): Promise<Repo[]> {
    if (userId) {
      const repoOwners = await this.repoOwnersRepository.find({
        where: { userId },
        relations: ['repo'],
      });
      
      return repoOwners.map(owner => owner.repo);
    }
    return this.reposRepository.find();
  }

  async create(createRepoDto: CreateRepoDto, userId: string): Promise<Repo> {
    const [owner, name] = createRepoDto.fullName.split('/');

    if (!owner || !name) {
      throw new HttpException(
        'Invalid format. Use owner/repo format',
        HttpStatus.BAD_REQUEST,
      );
    }

    let repo = await this.reposRepository.findOne({
      where: { owner, name },
    });

    if (repo) {
      const existingOwnership = await this.repoOwnersRepository.findOne({
        where: { repoId: repo.id, userId },
      });

      if (existingOwnership) {
        throw new HttpException(
          'Repository already added to your list',
          HttpStatus.CONFLICT,
        );
      }
    } else {
      const githubData = await this.githubService.fetchRepoData(owner, name);

      repo = new Repo();
      repo.owner = owner;
      repo.name = name;
      repo.htmlUrl = githubData.html_url;
      repo.stars = githubData.stargazers_count;
      repo.forks = githubData.forks_count;
      repo.openIssues = githubData.open_issues_count;
      repo.createdAt = githubData.created_at;
      
      repo = await this.reposRepository.save(repo);
    }

    const repoOwner = new RepoOwner();
    repoOwner.repoId = repo.id;
    repoOwner.userId = userId;
    await this.repoOwnersRepository.save(repoOwner);

    return repo;
  }

  async update(id: number, userId: string): Promise<Repo> {
    const ownership = await this.repoOwnersRepository.findOne({
      where: { repoId: id, userId },
      relations: ['repo'],
    });

    if (!ownership) {
      throw new HttpException('Repository not found', HttpStatus.NOT_FOUND);
    }

    return this.updateRepoData(id, ownership.repo.owner, ownership.repo.name);
  }

  async remove(id: number, userId: string): Promise<void> {
    const result = await this.repoOwnersRepository.delete({ repoId: id, userId });

    if (result.affected === 0) {
      throw new HttpException('Repository not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateRepoData(id: number, owner: string, name: string): Promise<Repo> {
    const githubData = await this.githubService.fetchRepoData(owner, name);

    await this.reposRepository.update(id, {
      stars: githubData.stargazers_count,
      forks: githubData.forks_count,
      openIssues: githubData.open_issues_count,
      createdAt: githubData.created_at,
    });

    const updatedRepo = await this.reposRepository.findOne({ where: { id } });
    if (!updatedRepo) {
      throw new HttpException('Repository not found', HttpStatus.NOT_FOUND);
    }

    return updatedRepo;
  }
}
