import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import homeImg from '../public/home.png';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    dispatch(login());      
    navigate('/dashboard');  
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '60px' }}>
      <img 
        src={homeImg} 
        alt="Home" 
        style={{ width: '180px', marginBottom: '32px', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
      />
      <h2 style={{ marginBottom: '12px' }}>مرحبًا في الصفحة الرئيسية</h2>
      <p style={{ marginBottom: '28px', color: '#666' }}>اضغط لتسجيل الدخول 👇</p>
      <button 
        onClick={handleLogin}
        style={{
          background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '24px',
          padding: '12px 36px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
          transition: 'background 0.2s, transform 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)')}
        onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)')}
      >
        تسجيل دخول
      </button>
    </div>
  );
};

export default HomePage;
