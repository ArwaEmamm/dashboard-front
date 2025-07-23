import React, { useEffect, useState, useRef, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {
  Grid,
  Paper, Typography, Box, TextField, Stack, Button,
  Pagination, Chip, Avatar, InputAdornment, IconButton,
  Card, CardContent, CardActions, Divider, Modal,
  Radio, RadioGroup, FormControlLabel, FormControl,
  CircularProgress
} from '@mui/material';
import {
  Delete, Search, Quiz as QuizIcon,
  HelpOutline, CalendarToday, Refresh
} from '@mui/icons-material';
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE;

type Option = {
  option: string;
  isCorrect: boolean;
};

type Question = {
  question: string;
  options: Option[];
};

type Quiz = {
  _id: string;
  title: string;
  description?: string;
  questions?: Question[];
  createdAt?: string;
};

const QuizzesList = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const quizzesPerPage = 6;
  const lastEventRef = useRef<string>('');

  const handleOpenQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setQuizModalOpen(true);
    setUserAnswers({});
  };

  const handleCloseQuiz = () => {
    setQuizModalOpen(false);
    setSelectedQuiz(null);
    setUserAnswers({});
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  // Fetch quizzes from backend
  const fetchQuizzes = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      console.log('Fetching quizzes from:', `${baseURL}/quizzes`);
      const res = await axios.get(`${baseURL}/quizzes`);
      console.log('Fetched quizzes:', res.data);
      
      const fetchedQuizzes = res.data.data || res.data || [];
      setQuizzes(fetchedQuizzes);
      
      console.log('Quizzes updated in state:', fetchedQuizzes.length);
      
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    } finally {
      if (showLoading) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, []);

  // Manual refresh function
  const handleManualRefresh = () => {
    console.log('Manual refresh triggered');
    fetchQuizzes(true);
  };

  // Listen for quiz creation events
  useEffect(() => {
    const handleQuizCreated = (event: any) => {
      console.log('Quiz created event received:', event);
      // تأخير بسيط للتأكد من حفظ البيانات في الخادم
      setTimeout(() => {
        fetchQuizzes();
      }, 500);
    };

    const handleStorageChange = () => {
      try {
        const lastEvent = localStorage.getItem('last-quiz-event');
        if (lastEvent && lastEvent !== lastEventRef.current) {
          lastEventRef.current = lastEvent;
          console.log('Storage change detected:', lastEvent);
          fetchQuizzes();
        }
      } catch (e) {
        console.log('localStorage not available');
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab became visible, refreshing...');
        fetchQuizzes();
      }
    };

    // Add event listeners
    window.addEventListener('quiz-created', handleQuizCreated);
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('quiz-created', handleQuizCreated);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchQuizzes]);

  // Initial load and periodic refresh
  useEffect(() => {
    console.log('Component mounted, fetching quizzes...');
    fetchQuizzes(true);
    
    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('Auto refresh triggered');
      fetchQuizzes();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchQuizzes]);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${baseURL}/quizzes/${id}`);
      console.log('Quiz deleted:', id);
      await fetchQuizzes();
    } catch (err) {
      console.error('Error deleting quiz:', err);
    }
  };

  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (q.description && q.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);
  const displayedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * quizzesPerPage,
    currentPage * quizzesPerPage
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  };

  if (loading) {
    return (
      <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          جاري تحميل الكويزات...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ 
      p: 3, 
      borderRadius: 3,
      bgcolor: 'background.paper',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)'
    }}>
      {/* Header with Search and Refresh */}
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} 
        alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={1} mb={{ xs: 2, sm: 0 }}>
          <QuizIcon color="primary" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">
            قائمة الكويزات
          </Typography>
          <Chip 
            label={`${filteredQuizzes.length} كويز`} 
            size="small"
            sx={{
              bgcolor: 'rgba(106, 17, 203, 0.08)',
              color: '#6a11cb'
            }}
          />
          {refreshing && (
            <CircularProgress size={16} sx={{ ml: 1 }} />
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            label="ابحث عن كويز"
            variant="outlined"
            size="small"
            sx={{ 
              width: { xs: '100%', sm: 300 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
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
          />
          
          <IconButton 
            onClick={handleManualRefresh}
            disabled={refreshing}
            sx={{
              bgcolor: 'rgba(106, 17, 203, 0.08)',
              '&:hover': {
                bgcolor: 'rgba(106, 17, 203, 0.16)'
              }
            }}
          >
            <Refresh sx={{ 
              color: '#6a11cb',
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }} />
          </IconButton>
        </Box>
      </Box>

      {/* Debug Info */}
      <Box mb={2} sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
        آخر تحديث: {new Date().toLocaleTimeString('ar-EG')} | 
        إجمالي الكويزات: {quizzes.length}
      </Box>

      {/* Quizzes Grid */}
      {displayedQuizzes.length === 0 ? (
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderRadius: 3
        }}>
          <HelpOutline sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {searchTerm ? 'لا توجد نتائج بحث' : 'لا توجد كويزات متاحة حالياً'}
          </Typography>
          {!searchTerm && (
            <Button 
              variant="outlined" 
              onClick={handleManualRefresh}
              sx={{ mt: 2 }}
              startIcon={<Refresh />}
              disabled={refreshing}
            >
              {refreshing ? 'جاري التحديث...' : 'تحديث القائمة'}
            </Button>
          )}
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {displayedQuizzes.map((quiz) => (
              <Grid item xs={12} sm={6} md={4} key={quiz._id}>
                <Card 
                  onClick={() => handleOpenQuiz(quiz)}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.12)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <QuizIcon color="primary" />
                      <Typography variant="h6" fontWeight="bold">
                        {quiz.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {quiz.description}
                    </Typography>
                  </CardContent>
                  <Divider sx={{ mx: 2 }} />
                  <CardActions sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 2
                  }}>
                    <Box>
                      {quiz.questions && (
                        <Chip
                          label={`${quiz.questions.length} أسئلة`}
                          size="small"
                          variant="outlined"
                          sx={{
                            bgcolor: 'rgba(106, 17, 203, 0.08)',
                            color: '#6a11cb'
                          }}
                        />
                      )}
                      {quiz.createdAt && (
                        <Chip
                          icon={<CalendarToday fontSize="small" />}
                          label={formatDate(quiz.createdAt)}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(quiz._id);
                      }}
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

      {/* Quiz Taking Modal */}
      <Modal open={quizModalOpen} onClose={handleCloseQuiz}>
        <Box sx={{
          position: 'absolute', 
          top: '50%', 
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          p: 3, 
          borderRadius: 3, 
          width: '95%', 
          maxWidth: 700, 
          maxHeight: '90vh', 
          overflowY: 'auto'
        }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{
            background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {selectedQuiz?.title}
          </Typography>
          
          {selectedQuiz?.description && (
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {selectedQuiz.description}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          {selectedQuiz?.questions?.map((q, index) => (
            <Box key={index} mb={3}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Chip 
                  label={`السؤال ${index + 1}`} 
                  size="small"
                  sx={{
                    bgcolor: 'rgba(106, 17, 203, 0.08)',
                    color: '#6a11cb'
                  }}
                />
                <Typography variant="subtitle1" fontWeight="bold">
                  {q.question}
                </Typography>
              </Box>
              
              <FormControl component="fieldset" sx={{ pl: 2 }}>
                <RadioGroup
                  value={userAnswers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                >
                  {q.options.map((opt, i) => (
                    <FormControlLabel
                      key={i}
                      value={i.toString()}
                      control={<Radio color="primary" />}
                      label={opt.option}
                      sx={{
                        mb: 1,
                        p: 1,
                        borderRadius: 2,
                        bgcolor: 'grey.50',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'grey.100',
                          transform: 'translateX(3px)'
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              
              {index < (selectedQuiz?.questions?.length || 0) - 1 && (
                <Divider sx={{ mt: 2 }} />
              )}
            </Box>
          ))}

          <Box mt={3} display="flex" justifyContent="space-between" gap={2}>
            <Button 
              variant="outlined" 
              onClick={handleCloseQuiz}
              sx={{
                borderRadius: 2,
                px: 3,
                borderColor: '#6a11cb',
                color: '#6a11cb',
                '&:hover': {
                  bgcolor: 'rgba(106, 17, 203, 0.08)'
                }
              }}
            >
              إغلاق
            </Button>
            <Button 
              variant="contained" 
              sx={{
                background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(106, 17, 203, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
              onClick={() => {
                setSnackbarOpen(true);
                setTimeout(() => {
                  setQuizModalOpen(false);
                  setSelectedQuiz(null);
                  setUserAnswers({});
                }, 1200);
              }}
            >
              إرسال الإجابات
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={1200} 
        onClose={() => setSnackbarOpen(false)} 
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <MuiAlert 
          elevation={6} 
          variant="filled" 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          تم إرسال إجاباتك!
        </MuiAlert>
      </Snackbar>
    </Paper>
  );
};

export default QuizzesList;