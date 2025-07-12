import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ name: 'user_id' })
  userId: string;
}
