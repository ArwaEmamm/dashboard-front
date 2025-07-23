import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import SectionContainer from '../components/SectionContainer';
import GradingIcon from '@mui/icons-material/Grading';

const GradeBook = () => {
  const grades = [
    { subject: 'اللغة العربية', grade: 'A+', percentage: '98%', date: '2023-10-15' },
    { subject: 'الرياضيات', grade: 'A', percentage: '92%', date: '2023-10-18' },
    { subject: 'العلوم', grade: 'B+', percentage: '87%', date: '2023-10-20' },
    { subject: 'اللغة الإنجليزية', grade: 'A-', percentage: '90%', date: '2023-10-22' },
  ];

  return (
    <SectionContainer title="دفتر الدرجات">
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <GradingIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">سجل الدرجات</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>المادة</TableCell>
                <TableCell align="center">الدرجة</TableCell>
                <TableCell align="center">النسبة</TableCell>
                <TableCell align="center">التاريخ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.subject}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={row.grade} 
                      color={
                        row.grade.includes('A') ? 'success' : 
                        row.grade.includes('B') ? 'warning' : 'error'
                      }
                    />
                  </TableCell>
                  <TableCell align="center">{row.percentage}</TableCell>
                  <TableCell align="center">{row.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </SectionContainer>
  );
};

export default GradeBook;