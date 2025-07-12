import { Box, CircularProgress, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import LoginPage from './LoginPage';
import type { ReactNode } from 'react';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { isLoading, isLoggedIn, logout, username } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GitHub Repository Manager
          </Typography>
          {username && (
            <Typography variant="body1" sx={{ mr: 2 }}>
              Welcome, {username}
            </Typography>
          )}
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
}

export default AuthenticatedLayout; 