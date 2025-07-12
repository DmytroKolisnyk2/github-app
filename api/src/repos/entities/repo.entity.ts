import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RepoOwner } from './repo-owner.entity';

@Entity('repos')
export class Repo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  owner: string;

  @Column()
  name: string;

  @Column({ name: 'html_url' })
  htmlUrl: string;

  @Column()
  stars: number;

  @Column()
  forks: number;

  @Column({ name: 'open_issues' })
  openIssues: number;

  @Column({ name: 'created_at' })
  createdAt: string;

  @Column({
    name: 'created_timestamp',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTimestamp: Date;

  @OneToMany(() => RepoOwner, (owner: RepoOwner) => owner.repo)
  owners: RepoOwner[];
}
