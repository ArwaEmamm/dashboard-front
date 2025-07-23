import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import SectionContainer from '../components/SectionContainer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const Schedule = () => {
  const scheduleItems = [
    { title: 'اختبار الرياضيات', date: '2023-11-05', type: 'اختبار' },
    { title: 'تسليم مشروع العلوم', date: '2023-11-10', type: 'تسليم' },
    { title: 'اختبار اللغة العربية', date: '2023-11-15', type: 'اختبار' },
    { title: 'إجازة منتصف الفصل', date: '2023-11-20', type: 'إجازة' },
  ];

  return (
    <SectionContainer title="الجدول الدراسي">
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <CalendarMonthIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">المواعيد القادمة</Typography>
        </Box>
        <List>
          {scheduleItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={item.title}
                  secondary={item.date}
                />
                <Chip 
                  label={item.type} 
                  size="small"
                  color={
                    item.type === 'اختبار' ? 'error' :
                    item.type === 'تسليم' ? 'warning' : 'success'
                  }
                />
              </ListItem>
              {index < scheduleItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </SectionContainer>
  );
};

export default Schedule;