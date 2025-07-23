import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          🧪 منصة الاختبارات
        </Typography>
        <Button color="inherit" onClick={handleLogout}>تسجيل الخروج</Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
