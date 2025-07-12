import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { addRepo } from '../services/api';

interface AddRepoDialogProps {
  open: boolean;
  onClose: () => void;
}

function AddRepoDialog({ open, onClose }: AddRepoDialogProps) {
  const [repoFullName, setRepoFullName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const addRepoMutation = useMutation({
    mutationFn: addRepo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repos'] });
      setRepoFullName('');
      onClose();
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const handleSubmit = () => {
    if (!repoFullName.trim()) {
      setError('Please enter a repository name');
      return;
    }
    
    if (!repoFullName.includes('/')) {
      setError('Repository must be in format owner/repo');
      return;
    }

    addRepoMutation.mutate(repoFullName);
  };

  const handleClose = () => {
    if (addRepoMutation.isPending) return;
    setRepoFullName('');
    setError(null);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add GitHub Repository</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the full name of the GitHub repository in the format owner/repo (e.g. facebook/react)
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="repo"
            label="Repository"
            fullWidth
            variant="outlined"
            placeholder="e.g. facebook/react"
            value={repoFullName}
            onChange={(e) => setRepoFullName(e.target.value)}
            error={!!error}
            helperText={error}
            disabled={addRepoMutation.isPending}
          />
          {addRepoMutation.isPending && (
            <CircularProgress size={24} sx={{ mt: 2, display: 'block', mx: 'auto' }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={addRepoMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={addRepoMutation.isPending}
          >
            {addRepoMutation.isPending ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddRepoDialog; 