import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Divider
} from '@mui/material';
import SectionContainer from '../components/SectionContainer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Performance = () => {
  const performanceData = [
    { subject: 'الرياضيات', progress: 85 },
    { subject: 'العلوم', progress: 72 },
    { subject: 'اللغة العربية', progress: 90 },
    { subject: 'اللغة الإنجليزية', progress: 68 },
  ];

  const overallProgress = performanceData.reduce((sum, item) => sum + item.progress, 0) / performanceData.length;

  return (
    <SectionContainer title="متابعة الأداء">
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <TrendingUpIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">تقرير الأداء</Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="subtitle1" gutterBottom>التقدم العام</Typography>
          <LinearProgress 
            variant="determinate" 
            value={overallProgress} 
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Typography variant="body2" textAlign="center" mt={1}>
            {Math.round(overallProgress)}%
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          {performanceData.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Typography variant="subtitle2" gutterBottom>
                {item.subject}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={item.progress} 
                sx={{ height: 8, borderRadius: 5 }}
              />
              <Typography variant="body2" textAlign="center" mt={1}>
                {item.progress}%
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </SectionContainer>
  );
};

export default Performance;