import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import RepoManager from './components/RepoManager';
import { AuthProvider } from './context/AuthContext';
import AuthenticatedLayout from './components/AuthenticatedLayout';

const queryClient = new QueryClient();
const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <AuthenticatedLayout>
              <RepoManager />
            </AuthenticatedLayout>
          </Container>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
