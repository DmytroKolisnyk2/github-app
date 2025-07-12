import { useState } from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { updateRepo, deleteRepo } from '../services/api';
import type { Repo } from '../services/api';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface RepoListProps {
  repos: Repo[];
  isLoading: boolean;
  onAddClick: () => void;
}

const RepoList = ({ repos, isLoading, onAddClick }: RepoListProps) => {
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: updateRepo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['repos'] });

      queryClient.setQueryData(['repos'], (oldData: Repo[] | undefined) => {
        if (!oldData) return [data];
        return oldData.map((repo) => (repo.id === data.id ? data : repo));
      });
    },
    onSettled: () => {
      setUpdatingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRepo,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['repos'] });
      queryClient.setQueryData(['repos'], (oldData: Repo[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter((repo) => repo.id !== id);
      });
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleUpdate = (id: number) => {
    setUpdatingId(id);
    updateMutation.mutate(id);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    deleteMutation.mutate(id);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (repos.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography variant='body1' gutterBottom>
          No repositories found. Add your first GitHub repository!
        </Typography>
        <Button variant='contained' color='primary' startIcon={<AddIcon />} onClick={onAddClick}>
          Add Repository
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant='contained' color='primary' startIcon={<AddIcon />} onClick={onAddClick}>
          Add Repository
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Repository</TableCell>
              <TableCell>Stars</TableCell>
              <TableCell>Forks</TableCell>
              <TableCell>Issues</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {repos.map((repo) => (
              <TableRow key={repo.id}>
                <TableCell>
                  <Link href={repo.htmlUrl} target='_blank' rel='noopener noreferrer'>
                    {repo.owner}/{repo.name}
                  </Link>
                </TableCell>
                <TableCell>{repo.stars.toLocaleString()}</TableCell>
                <TableCell>{repo.forks.toLocaleString()}</TableCell>
                <TableCell>{repo.openIssues.toLocaleString()}</TableCell>
                <TableCell>{formatDate(repo.createdAt)}</TableCell>
                <TableCell>
                  <Tooltip title='Update repository data'>
                    <IconButton color='primary' onClick={() => handleUpdate(repo.id)} disabled={updatingId === repo.id}>
                      {updatingId === repo.id ? <CircularProgress size={24} /> : <RefreshIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Delete repository'>
                    <IconButton color='error' onClick={() => handleDelete(repo.id)} disabled={deletingId === repo.id}>
                      {deletingId === repo.id ? <CircularProgress size={24} /> : <DeleteIcon />}
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default RepoList;
