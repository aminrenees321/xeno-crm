import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const Loading = ({ message }) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="200px"
    >
      <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
      <Typography variant="body1">{message || 'Loading...'}</Typography>
    </Box>
  );
};

export default Loading;