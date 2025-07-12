import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GithubRepoData } from '../types/github.types';

@Injectable()
export class GithubService {
  private readonly apiBaseUrl = 'https://api.github.com';

  async fetchRepoData(owner: string, repo: string): Promise<GithubRepoData> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/repos/${owner}/${repo}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'GitHub-App',
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new HttpException('Repository not found', HttpStatus.NOT_FOUND);
        }
        throw new HttpException(
          'GitHub API error',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      return response.json() as Promise<GithubRepoData>;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch repo data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
