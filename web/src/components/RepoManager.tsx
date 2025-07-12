import { useState } from 'react';
import { Box, Typography, Paper, Alert, Snackbar } from '@mui/material';
import RepoList from './RepoList';
import AddRepoDialog from './AddRepoDialog';
import { useQuery } from '@tanstack/react-query';
import { fetchRepos } from '../services/api';
import { useAuth } from '../hooks/useAuth';

function RepoManager() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user } = useAuth();

  const { 
    data: repos, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['repos', user?.id],
    queryFn: fetchRepos,
    refetchInterval: 10000,
  });

  const handleCloseError = () => {
    setErrorMessage(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your GitHub Repositories
      </Typography>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <RepoList 
          repos={repos || []} 
          isLoading={isLoading}
          onAddClick={() => setIsAddDialogOpen(true)}
        />
      </Paper>

      <AddRepoDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />

      <Snackbar 
        open={isError || !!errorMessage} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
      >
        <Alert severity="error" onClose={handleCloseError}>
          {errorMessage || (error instanceof Error ? error.message : 'An error occurred')}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default RepoManager; 