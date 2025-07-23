import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent,
  Avatar, Divider, Button, List, ListItem,
  ListItemAvatar, ListItemText, Paper, Badge, Chip,
  Select, MenuItem, FormControl
} from '@mui/material';
import { Quiz, Announcement, Lightbulb, School, Event, Stars, Translate } from '@mui/icons-material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const baseURL = process.env.REACT_APP_API_BASE;

type AnnouncementType = {
  _id?: string;
  title?: string;
  description?: string;
  createdBy?: string;
  createdAt?: string;
};

const DashboardHome = () => {
  const [quizzesCount, setQuizzesCount] = useState(0);
  const [announcementsCount, setAnnouncementsCount] = useState(0);
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch announcements
        const announcementsRes = await axios.get(`${baseURL}/announcements`);
        let announcementsData = announcementsRes.data;
        let announcementsArr: AnnouncementType[] = [];
        if (announcementsData && announcementsData.data && Array.isArray(announcementsData.data)) {
          announcementsArr = announcementsData.data;
        } else if (Array.isArray(announcementsData)) {
          announcementsArr = announcementsData;
        }
        setAnnouncements(announcementsArr);
        setAnnouncementsCount(announcementsArr.slice(0, 4).length);

        // Fetch quizzes
        const quizzesRes = await axios.get(`${baseURL}/quizzes`);
        let quizzesData = quizzesRes.data;
        let quizzesArr: any[] = [];
        if (quizzesData && quizzesData.data && Array.isArray(quizzesData.data)) {
          quizzesArr = quizzesData.data;
        } else if (Array.isArray(quizzesData)) {
          quizzesArr = quizzesData;
        }
        setQuizzesCount(quizzesArr.length);
      } catch (error) {
        setAnnouncements([]);
        setAnnouncementsCount(0);
        setQuizzesCount(0);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box sx={{ 
      p: 3, 
      background: 'radial-gradient(circle at top right, #f5f7fa 0%, #e4e8f0 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box sx={{ 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 4,
      p: 2,
      borderRadius: 3,
      background: 'rgba(255,255,255,0.8)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    }}>
      <Typography variant="h4" sx={{
        fontWeight: 'bold',
        background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        أكاديمية التميز
      </Typography>
      <Box display="flex" alignItems="center" gap={2}>
        {/* Translation icon and language switcher */}
        <Translate sx={{ color: '#6a11cb', fontSize: 32, mr: 1, bgcolor: 'rgba(106,17,203,0.08)', borderRadius: '50%', p: 0.5, boxShadow: 2 }} />
        <FormControl variant="standard" sx={{ minWidth: 80 }}>
          <Select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            sx={{ color: '#6a11cb', fontWeight: 'bold', bgcolor: 'rgba(106,17,203,0.08)', borderRadius: 2, minWidth: 60 }}
            disableUnderline
          >
            <MenuItem value="ar">عربي</MenuItem>
            <MenuItem value="en">EN</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>

      {/* Welcome Section */}
      <Card sx={{ 
        mb: 4, 
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        color: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(106, 17, 203, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)'
        }
      }}>
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Stars sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 500 }}>
              مرحبًا تاليا،
            </Typography>
          </Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            استعدي لامتحاناتك
          </Typography>
          <Typography variant="body1" paragraph sx={{ opacity: 0.9, fontSize: '1.1rem' }}>
            لدينا كل ما تحتاجينه للتفوق هذا الفصل الدراسي
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Lightbulb />}
            sx={{ 
              mt: 2,
              bgcolor: 'white',
              color: '#6a11cb',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '12px',
              px: 3,
              py: 1,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            اكتشف النصائح
          </Button>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            color: 'white',
            boxShadow: '0 8px 25px rgba(17, 153, 142, 0.3)'
          }}>
            <CardContent sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  الكويزات المتاحة
                </Typography>
                <Typography variant="h2" fontWeight="bold" sx={{ mt: 1 }}>
                  {quizzesCount}
                </Typography>
              </Box>
              <Avatar sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                width: 64,
                height: 64,
                '& svg': { fontSize: '2rem' }
              }}>
                <Quiz />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #f46b45 0%, #eea849 100%)',
            color: 'white',
            boxShadow: '0 8px 25px rgba(244, 107, 69, 0.3)'
          }}>
            <CardContent sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  الإعلانات المهمة
                </Typography>
                <Typography variant="h2" fontWeight="bold" sx={{ mt: 1 }}>
                  {announcementsCount}
                </Typography>
              </Box>
              <Avatar sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                width: 64,
                height: 64,
                '& svg': { fontSize: '2rem' }
              }}>
                <Announcement />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Content Sections */}
      <Grid container spacing={3}>
        {/* Announcements */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: '16px',
            background: 'white',
            boxShadow: '0 8px 30px rgba(0,0,0,0.05)'
          }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Typography variant="h5" fontWeight="bold" sx={{ 
                background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                آخر الإعلانات
              </Typography>
              <Chip 
                label="جديد" 
                color="secondary" 
                size="small" 
                sx={{ 
                  ml: 2,
                  background: 'linear-gradient(90deg, #ff8a00 0%, #e52e71 100%)',
                  color: 'white',
                  fontWeight: 'bold'
                }} 
              />
            </Box>
            
            <List sx={{ 
              '& .MuiListItem-root': {
                borderRadius: '12px',
                mb: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: '#f9f9f9',
                  transform: 'translateX(5px)'
                }
              }
            }}>
              {announcements.length > 0 ? (
                announcements.slice(0, 4).map((item, index) => (
                  <React.Fragment key={item._id || index}>
                    <ListItem sx={{ px: 2 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: getRandomGradient(),
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {item.createdBy ? item.createdBy.split(' ')[0][0] : (item.title ? item.title[0] : '?')}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                            {item.title}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {item.description}
                            </Typography>
                            <Box sx={{ display: 'flex', mt: 1 }}>
                              {item.createdBy && item.createdBy !== 'Admin' && (
                                <Chip 
                                  label={`بواسطة: ${item.createdBy}`} 
                                  size="small" 
                                  sx={{ mr: 1, background: '#f0f0f0' }} 
                                />
                              )}
                              {item.createdAt && (
                                <Chip 
                                  label={new Date(item.createdAt).toLocaleDateString('ar-EG')} 
                                  size="small" 
                                  sx={{ background: '#f0f0f0' }} 
                                />
                              )}
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                    {index < 3 && <Divider sx={{ my: 1 }} />}
                  </React.Fragment>
                ))
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  background: 'linear-gradient(90deg, #f5f7fa 0%, #e4e8f0 100%)',
                  borderRadius: '12px'
                }}>
                  <Typography variant="body1" color="text.secondary">
                    لا توجد إعلانات حالياً
                  </Typography>
                </Box>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Tasks */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: '16px',
            background: 'white',
            boxShadow: '0 8px 30px rgba(0,0,0,0.05)'
          }}>
            <Typography variant="h5" fontWeight="bold" sx={{ 
              mb: 3,
              background: 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              المهام القادمة
            </Typography>
            
            <List>
              {[
                {
                  title: "اختبار الوحدة 2",
                  course: "الرياضيات",
                  date: "20 ديسمبر",
                  color: '#6a11cb'
                },
                {
                  title: "تسليم البحث",
                  course: "اللغة العربية",
                  date: "22 ديسمبر",
                  color: '#2575fc'
                },
                {
                  title: "مشروع العلوم",
                  course: "الأحياء",
                  date: "25 ديسمبر",
                  color: '#11998e'
                }
              ].map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ 
                    px: 0,
                    '&:hover': {
                      '& .task-badge': {
                        transform: 'scale(1.1)'
                      }
                    }
                  }}>
                    <Box sx={{ 
                      width: 12,
                      height: 40,
                      background: item.color,
                      borderRadius: '4px 0 0 4px',
                      mr: 2
                    }} />
                    <ListItemText
                      primary={
                        <Typography fontWeight="bold">
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {item.course} • {item.date}
                        </Typography>
                      }
                    />
                    <Box className="task-badge" sx={{
                      background: 'rgba(0,0,0,0.05)',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }}>
                      <Event sx={{ color: item.color }} />
                    </Box>
                  </ListItem>
                  {index < 2 && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
              ))}
            </List>
            
            <Button 
              fullWidth 
              variant="outlined" 
              sx={{ 
                mt: 2,
                borderRadius: '12px',
                py: 1.5,
                borderColor: '#6a11cb',
                color: '#6a11cb',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'rgba(106, 17, 203, 0.05)',
                  borderColor: '#6a11cb'
                }
              }}
            >
              عرض جميع المهام
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Helper functions for random gradients
function getRandomGradient() {
  const gradients = [
    'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    'linear-gradient(135deg, #f46b45 0%, #eea849 100%)',
    'linear-gradient(135deg, #ff8a00 0%, #e52e71 100%)'
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}

export default DashboardHome;