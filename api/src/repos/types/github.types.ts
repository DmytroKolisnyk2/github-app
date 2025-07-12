export interface GithubRepoData {
  name: string;
  owner: {
    login: string;
  };
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
}
