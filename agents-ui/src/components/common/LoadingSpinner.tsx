import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      height="50vh"
    >
      <CircularProgress size={40} />
      <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;