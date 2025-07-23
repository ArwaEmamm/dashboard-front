import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import {
  Grid,
  Paper, Typography, Box, TextField, Stack, Button,
  Pagination, Chip, Avatar, InputAdornment, IconButton,
  Card, CardContent, CardActions, Divider
} from '@mui/material';
import {
  Delete, Add, Search, 
  Announcement as AnnouncementIcon,
  CalendarToday
} from '@mui/icons-material';
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE;

type Announcement = {
  _id: string;
  title: string;
  description: string;
  createdBy?: string;
  createdAt?: string;
};

const ITEMS_PER_PAGE = 6;
const STORAGE_KEY = 'announcements_data';

const Announcements = () => {
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: AlertColor}>({open: false, message: '', severity: 'error'});
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Save announcements to local storage
  const saveToLocalStorage = (data: Announcement[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Load announcements from local storage
  const loadFromLocalStorage = (): Announcement[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  };

  // Fetch announcements from server and merge with local data
  const fetchData = async () => {
    try {
      const res = await axios.get(`${baseURL}/announcements`);
      let serverData = [];
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        serverData = res.data.data;
      } else if (Array.isArray(res.data)) {
        serverData = res.data;
      }
      const localData = loadFromLocalStorage();
      const mergedData = [...localData, ...serverData];
      const uniqueData = mergedData.filter((item, index, self) => 
        index === self.findIndex((t) => t._id === item._id)
      );
      setAnnouncements(uniqueData);
      saveToLocalStorage(uniqueData);
    } catch (err) {
      const localData = loadFromLocalStorage();
      setAnnouncements(localData);
    }
  };

  // Load local data first, then try to update from server
  React.useEffect(() => {
    const localData = loadFromLocalStorage();
    setAnnouncements(localData);
    fetchData();
  }, []);

  // Delete announcement from server and local
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${baseURL}/announcements/${id}`);
    } catch (err) {
      console.error('Error deleting from server:', err);
    }
    const updatedAnnouncements = announcements.filter(a => a._id !== id);
    setAnnouncements(updatedAnnouncements);
    saveToLocalStorage(updatedAnnouncements);
  };

  // Add new announcement (with validation)
  const handleAdd = async () => {
    if (!formTitle.trim()) {
      setSnackbar({ open: true, message: '✏️ العنوان مطلوب', severity: 'warning' });
      return;
    }
    if (formTitle.length < 3 || formTitle.length > 50) {
      setSnackbar({ open: true, message: '✏️ العنوان يجب أن يكون بين 3 و 50 حرفًا', severity: 'warning' });
      return;
    }
    if (!formDescription.trim()) {
      setSnackbar({ open: true, message: '📝 المحتوى مطلوب', severity: 'warning' });
      return;
    }

    const newAnnouncement: Announcement = {
      _id: Date.now().toString(),
      title: formTitle,
      description: formDescription,
      createdBy: 'Admin',
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axios.post(`${baseURL}/announcements`, {
        title: formTitle,
        description: formDescription,
        createdBy: 'Admin',
      });
      newAnnouncement._id = res.data._id;
      newAnnouncement.createdAt = res.data.createdAt || newAnnouncement.createdAt;
    } catch (err) {
      console.error('Error adding to server:', err);
      setSnackbar({ open: true, message: 'تم إضافة الإعلان محلياً (سيتم مزامنته لاحقاً)', severity: 'info' });
    }

    const updatedAnnouncements = [newAnnouncement, ...announcements];
    setAnnouncements(updatedAnnouncements);
    saveToLocalStorage(updatedAnnouncements);
    setCurrentPage(1);
    setFormTitle('');
    setFormDescription('');
    if (!snackbar.open) {
      setSnackbar({ open: true, message: 'تمت إضافة الإعلان بنجاح', severity: 'success' });
    }
  };

  // Filter announcements by search term
  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.description && a.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);
  const paginatedAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  };

  return (
    <Paper elevation={0} sx={{ 
      p: 3, 
      borderRadius: 3,
      bgcolor: 'background.paper',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)'
    }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <AnnouncementIcon color="primary" fontSize="large" />
        <Typography variant="h5" fontWeight="bold">الإعلانات</Typography>
      </Box>

      {/* Search and Add Form */}
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} mb={4}>
        <TextField
          label="ابحث عن إعلان"
          fullWidth
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          sx={{
            borderRadius: 2,
            px: 3,
            minWidth: 180,
            height: 56
          }}
        >
          إضافة إعلان
        </Button>
      </Box>

      {/* Add Announcement Form */}
      <Paper sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 3, 
        bgcolor: 'grey.50',
        border: '1px solid rgba(0, 0, 0, 0.08)'
      }}>
        <Stack spacing={2}>
          <TextField
            label="عنوان الإعلان"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="محتوى الإعلان"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
          />
        </Stack>
      </Paper>

      {/* Announcements Grid */}
      {filteredAnnouncements.length === 0 ? (
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderRadius: 3
        }}>
          <Typography variant="h6" color="text.secondary">
            {searchTerm ? 'لا توجد نتائج بحث' : 'لا توجد إعلانات متاحة حالياً'}
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedAnnouncements.map((ann) => (
              <Grid item xs={12} sm={6} md={4} key={ann._id}>
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
                      <AnnouncementIcon color="primary" />
                      <Typography variant="h6" fontWeight="bold">
                        {ann.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {ann.description}
                    </Typography>
                  </CardContent>
                  <Divider sx={{ mx: 2 }} />
                  <CardActions sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 2
                  }}>
                    <Box>
                      {ann.createdAt && (
                        <Chip
                          icon={<CalendarToday fontSize="small" />}
                          label={formatDate(ann.createdAt)}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <IconButton 
                      onClick={() => handleDelete(ann._id)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, value) => setCurrentPage(value)}
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: '1rem',
                    '&.Mui-selected': {
                      fontWeight: 'bold'
                    }
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Snackbar for messages */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar(s => ({...s, open: false}))} 
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <MuiAlert 
          elevation={6} 
          variant="filled" 
          onClose={() => setSnackbar(s => ({...s, open: false}))} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Paper>
  );
};

export default Announcements;