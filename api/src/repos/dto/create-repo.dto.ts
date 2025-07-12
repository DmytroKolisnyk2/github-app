import { IsString, Matches } from 'class-validator';

export class CreateRepoDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9-]+\/[a-zA-Z0-9-_.]+$/, {
    message:
      'Repository name must be in format owner/repo (e.g. torvalds/linux)',
  })
  fullName: string;
}
