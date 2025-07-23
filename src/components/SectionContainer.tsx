import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

type Props = {
  title: string;
  children: React.ReactNode;
};

const SectionContainer = ({ title, children }: Props) => {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Box mt={2}>{children}</Box>
    </Paper>
  );
};

export default SectionContainer;
