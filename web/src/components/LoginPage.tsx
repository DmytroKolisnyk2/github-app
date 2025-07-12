import { Button, Box, Typography, Paper, Divider, Stack } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const { login, register } = useAuth();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 500, width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          GitHub Repository Manager
        </Typography>
        <Typography variant="body1" paragraph>
          Please log in to access your GitHub repositories
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" size="large" onClick={login}>
            Login with Email
          </Button>
          <Divider sx={{ my: 1 }}>or</Divider>
          <Button variant="outlined" color="primary" onClick={register}>
            Create an Account
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default LoginPage; 