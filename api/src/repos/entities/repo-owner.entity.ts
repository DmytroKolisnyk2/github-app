import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Repo } from './repo.entity';

@Entity('repo_owners')
export class RepoOwner {
  @PrimaryColumn({ name: 'repo_id' })
  repoId: number;

  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Repo, repo => repo.owners)
  @JoinColumn({ name: 'repo_id' })
  repo: Repo;
} 