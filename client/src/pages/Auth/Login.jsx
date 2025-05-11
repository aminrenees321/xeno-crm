import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useAuth } from '../../services/auth';

function Login() {
  const { googleLogin } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center'
      }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Xeno CRM
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ mb: 4 }}>
          Please sign in to continue
        </Typography>
        <Button
          variant="contained"
          onClick={googleLogin}
          size="large"
        >
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
}

export default Login;