import { getToken, updateToken } from './keycloak';

export interface Repo {
  id: number;
  owner: string;
  name: string;
  htmlUrl: string;
  stars: number;
  forks: number;
  openIssues: number;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  repos: Repo[];
}

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = async () => {
  try {
    await updateToken(60);
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  } catch (error) {
    console.error('Failed to get auth token', error);
    throw new Error('Authentication required');
  }
};

export async function fetchRepos(): Promise<Repo[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/repos`, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching repos:', error);
    throw error;
  }
}

export async function addRepo(fullName: string): Promise<Repo> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/repos`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ fullName }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add repository: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error adding repo:', error);
    throw error;
  }
}

export async function updateRepo(id: number): Promise<Repo> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/repos/${id}/update`, {
      method: 'PUT',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update repository: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error updating repo:', error);
    throw error;
  }
}

export async function deleteRepo(id: number): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/repos/${id}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete repository: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting repo:', error);
    throw error;
  }
}

export async function getUserProfile(): Promise<User> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/auth/profile`, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}
