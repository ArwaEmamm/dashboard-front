import React from 'react';
import { Button, Paper, TextField, Typography, Box, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    dispatch(login());
    navigate('/dashboard');
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={4} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" gutterBottom>🔐 تسجيل الدخول</Typography>
        <Stack spacing={2}>
          <TextField label="البريد الإلكتروني" fullWidth />
          <TextField label="كلمة المرور" type="password" fullWidth />
          <Button variant="contained" onClick={handleLogin}>دخول</Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Login;
