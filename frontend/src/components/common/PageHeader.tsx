import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { PageHeaderProps } from '@types';

export const PageHeader: React.FC<PageHeaderProps> = ({ title, onBackClick }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button
        onClick={onBackClick}
        variant='outlined'
        sx={{ mb: 2 }}
        aria-label='Back to home'
      >
        <ArrowBackIcon />
      </Button>
      <Typography variant='h4' component='h1' gutterBottom align='center'>
        {title}
      </Typography>
      <Box sx={{ width: '52px', display: 'block' }}>&nbsp;</Box>
    </Box>
  );
};