import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Avatar,
  Box
} from '@mui/material';
import { useAuth } from '../../services/auth';

const Header = () => {
  const { user, logout } = useAuth();
  
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Xeno CRM
        </Typography>
        
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar alt={user.name} src={user.avatar} />
            <Button 
              color="inherit" 
              onClick={logout}
              sx={{ textTransform: 'none' }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
