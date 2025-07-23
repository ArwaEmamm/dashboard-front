import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import {
  Delete,
  School,
  Add,
  Star,
  CalendarToday,
  ErrorOutline
} from '@mui/icons-material';
import axios from 'axios';
import SectionContainer from '../components/SectionContainer';

const baseURL = process.env.REACT_APP_API_BASE;

type Course = {
  _id: string;
  title: string;
  description: string;
  level: string;
  createdAt?: string;
};

const Courses = () => {
  // Main courses list
  const [courses, setCourses] = useState<Course[]>([]);
  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLevel, setFormLevel] = useState('مبتدئ');
  // Snackbar for user messages
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'warning' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch courses from server
  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${baseURL}/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setSnackbar({ open: true, message: 'حدث خطأ في جلب البيانات', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Delete course from server and local
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${baseURL}/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      setSnackbar({ open: true, message: 'تم حذف الكورس بنجاح', severity: 'success' });
    } catch (err) {
      console.error('Error deleting course:', err);
      setSnackbar({ open: true, message: 'حدث خطأ أثناء الحذف', severity: 'error' });
    }
  };

  // Add new course (with validation)
  const handleAddCourse = async () => {
    if (!formTitle.trim() || !formDescription.trim()) {
      setSnackbar({ open: true, message: 'يرجى ملء جميع الحقول', severity: 'warning' });
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/courses`, {
        title: formTitle,
        description: formDescription,
        level: formLevel,
        image: '',
      });
      setCourses([res.data, ...courses]);
      setFormTitle('');
      setFormDescription('');
      setFormLevel('مبتدئ');
      setSnackbar({ open: true, message: 'تم إضافة الكورس بنجاح', severity: 'success' });
    } catch (err) {
      console.error('Error adding course:', err);
      setSnackbar({ open: true, message: 'حدث خطأ أثناء الإضافة', severity: 'error' });
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  };

  // Get color for course level chip
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'مبتدئ': return 'success';
      case 'متوسط': return 'warning';
      case 'متقدم': return 'error';
      default: return 'primary';
    }
  };

  return (
    <SectionContainer title="📚 الكورسات">
      {/* Add new course */}
      <Paper sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 3, 
        bgcolor: 'background.paper',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)'
      }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Add color="primary" />
          <Typography variant="h6" fontWeight="bold">إضافة كورس جديد</Typography>
        </Box>
        <Stack spacing={2}>
          <TextField
            label="عنوان الكورس"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="وصف الكورس"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
          />
          <FormControl fullWidth>
            <InputLabel>المستوى</InputLabel>
            <Select 
              value={formLevel} 
              label="المستوى" 
              onChange={(e) => setFormLevel(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="مبتدئ">مبتدئ</MenuItem>
              <MenuItem value="متوسط">متوسط</MenuItem>
              <MenuItem value="متقدم">متقدم</MenuItem>
            </Select>
          </FormControl>
          <Button 
            variant="contained" 
            onClick={handleAddCourse}
            startIcon={<Add />}
            size="large"
            sx={{ mt: 1 }}
          >
            إضافة الكورس
          </Button>
        </Stack>
      </Paper>

      {/* Show courses */}
      {courses.length === 0 ? (
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderRadius: 3
        }}>
          <ErrorOutline sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            لا توجد كورسات متاحة حالياً
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.12)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <School color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      {course.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {course.description}
                  </Typography>
                </CardContent>
                <Divider sx={{ mx: 2 }} />
                <CardActions sx={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2
                }}>
                  <Box>
                    <Chip 
                      label={course.level}
                      size="small"
                      color={getLevelColor(course.level)}
                      variant="outlined"
                    />
                    {course.createdAt && (
                      <Chip
                        icon={<CalendarToday fontSize="small" />}
                        label={formatDate(course.createdAt)}
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                  <IconButton 
                    onClick={() => handleDelete(course._id)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SectionContainer>
  );
};

export default Courses;