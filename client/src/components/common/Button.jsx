import React from 'react';
import { Button as MuiButton } from '@mui/material';

const Button = ({ children, ...props }) => {
  return (
    <MuiButton 
      variant="contained" 
      color="primary"
      sx={{
        textTransform: 'none',
        borderRadius: '8px',
        padding: '8px 16px',
        ...props.sx
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;