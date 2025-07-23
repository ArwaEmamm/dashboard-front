import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 220;

const DashboardSideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#1976d2',
        }}
      >
        <Toolbar sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' } }}>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } }}>
            🧪 {t('platformTitle')}
          </Typography>
          <Button color="inherit" onClick={handleLogout} sx={{ mt: { xs: 1, sm: 0 }, fontSize: { xs: '0.95rem', sm: '1rem' } }}>
            {t('logout')}
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: { xs: '100%', sm: drawerWidth },
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: { xs: '100%', sm: drawerWidth },
            boxSizing: 'border-box',
            top: { xs: 56, sm: 64 },
            left: 0,
            borderRight: { xs: 'none', sm: '1px solid #eee' },
          },
          display: { xs: 'block', sm: 'block' },
        }}
      >
        <List sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, p: { xs: 0, sm: 2 }, gap: { xs: 0, sm: 1 }, overflowX: { xs: 'auto', sm: 'visible' } }}>
          <ListItem button component={Link} to="quizzes" sx={{ minWidth: { xs: 120, sm: 'auto' }, flex: { xs: 1, sm: 'none' } }}>
            <ListItemText primary={"📚 " + t('quizzes')} sx={{ textAlign: { xs: 'center', sm: 'left' } }} />
          </ListItem>
          <ListItem button component={Link} to="announcements" sx={{ minWidth: { xs: 120, sm: 'auto' }, flex: { xs: 1, sm: 'none' } }}>
            <ListItemText primary={"📢 " + t('announcements')} sx={{ textAlign: { xs: 'center', sm: 'left' } }} />
          </ListItem>
          <ListItem button component={Link} to="create-quiz" sx={{ minWidth: { xs: 120, sm: 'auto' }, flex: { xs: 1, sm: 'none' } }}>
            <ListItemText primary={" " + t('addQuiz')} sx={{ textAlign: { xs: 'center', sm: 'left' } }} />
          </ListItem>
          <ListItem button component={Link} to="courses" sx={{ minWidth: { xs: 120, sm: 'auto' }, flex: { xs: 1, sm: 'none' } }}>
            <ListItemText primary={"📘 " + t('courses')} sx={{ textAlign: { xs: 'center', sm: 'left' } }} />
          </ListItem>
          <ListItem button component={Link} to="gradebook" sx={{ minWidth: { xs: 120, sm: 'auto' }, flex: { xs: 1, sm: 'none' } }}>
            <ListItemText primary={"📝 " + t('gradebook')} sx={{ textAlign: { xs: 'center', sm: 'left' } }} />
          </ListItem>
          <ListItem button component={Link} to="performance" sx={{ minWidth: { xs: 120, sm: 'auto' }, flex: { xs: 1, sm: 'none' } }}>
            <ListItemText primary={"📈 " + t('performance')} sx={{ textAlign: { xs: 'center', sm: 'left' } }} />
          </ListItem>
          <ListItem button component={Link} to="schedule" sx={{ minWidth: { xs: 120, sm: 'auto' }, flex: { xs: 1, sm: 'none' } }}>
            <ListItemText primary={"📅 " + t('schedule')} sx={{ textAlign: { xs: 'center', sm: 'left' } }} />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f9f9f9',
          p: { xs: 1, sm: 3 },
          mt: { xs: 7, sm: 8 },
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardSideBar;
