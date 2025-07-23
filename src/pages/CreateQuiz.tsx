import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import {
  Paper, Typography, Box, TextField,
  Stack, Button, IconButton
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE;

type Question = {
  id: number;
  text: string;
  options: string[];
};

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: Date.now(),
      text: '',
      options: ['', '']
    }
  ]);

  const handleQuestionChange = (id: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, text: value } : q))
    );
  };

  const handleOptionChange = (
    questionId: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              )
            }
          : q
      )
    );
  };

  const addOption = (questionId: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [...q.options, '']
            }
          : q
      )
    );
  };

  const deleteOption = (questionId: number, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((_, idx) => idx !== optionIndex)
            }
          : q
      )
    );
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        text: '',
        options: ['', '']
      }
    ]);
  };

  const deleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: AlertColor}>({open: false, message: '', severity: 'info'});

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!title.trim() || !description.trim()) {
      setSnackbar({open: true, message: '❌ يرجى ملء عنوان ووصف الكويز', severity: 'warning'});
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.text.trim()) {
        setSnackbar({open: true, message: `❌ يرجى كتابة نص للسؤال رقم ${i + 1}`, severity: 'warning'});
        return;
      }

      if (q.options.length < 2) {
        setSnackbar({open: true, message: `❌ السؤال رقم ${i + 1} يجب أن يحتوي على خيارين على الأقل`, severity: 'warning'});
        return;
      }

      const hasEmptyOption = q.options.some((o) => !o.trim());
      if (hasEmptyOption) {
        setSnackbar({open: true, message: `❌ جميع الاختيارات في السؤال رقم ${i + 1} يجب أن تكون غير فارغة`, severity: 'warning'});
        return;
      }
    }

    const quizPayload = {
      title,
      description,
      questions: questions.map((q) => ({
        question: q.text,
        options: q.options.map(opt => ({ option: opt, isCorrect: false })),
      })),
      createdBy: 'Admin',
    };

    try {
      setIsSubmitting(true);
      
      const response = await axios.post(`${baseURL}/quizzes`, quizPayload);
      console.log('Quiz created:', response.data);
      
      setSnackbar({open: true, message: '✅ تم إنشاء الكويز بنجاح', severity: 'success'});

      setTitle('');
      setDescription('');
      setQuestions([
        {
          id: Date.now(),
          text: '',
          options: ['', ''],
        },
      ]);

      window.dispatchEvent(new CustomEvent('quiz-created', {
        detail: { 
          quiz: response.data,
          timestamp: Date.now()
        }
      }));

      try {
        const event = {
          type: 'QUIZ_CREATED',
          timestamp: Date.now(),
          data: response.data
        };
        localStorage.setItem('last-quiz-event', JSON.stringify(event));
      } catch (e) {
        console.log('localStorage not available');
      }

    } catch (err) {
      console.error('Error creating quiz:', err);
      setSnackbar({
        open: true, 
        message: '❌ حدث خطأ أثناء حفظ الكويز. تأكد من اتصال الإنترنت والخادم', 
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        ➕ إضافة كويز جديد
      </Typography>
      <Box mt={2}>
        <Stack spacing={2}>
          <TextField
            label="عنوان الكويز"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            disabled={isSubmitting}
          />
          <TextField
            label="وصف الكويز"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            disabled={isSubmitting}
          />
          {questions.map((q, qIdx) => (
            <Box key={q.id} sx={{ border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <TextField
                  label={`السؤال ${qIdx + 1}`}
                  value={q.text}
                  onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                  fullWidth
                  disabled={isSubmitting}
                />
                <IconButton 
                  onClick={() => deleteQuestion(q.id)}
                  color="error"
                  disabled={questions.length === 1 || isSubmitting}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              {q.options.map((opt, idx) => (
                <Box key={idx} display="flex" alignItems="center" gap={2} mt={1}>
                  <TextField
                    label={`اختيار ${idx + 1}`}
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(q.id, idx, e.target.value)
                    }
                    fullWidth
                    disabled={isSubmitting}
                  />
                  <IconButton 
                    onClick={() => deleteOption(q.id, idx)}
                    color="error"
                    disabled={q.options.length <= 2 || isSubmitting}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              
              <Box mt={2}>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addOption(q.id)}
                  variant="outlined"
                  size="small"
                  disabled={isSubmitting}
                >
                  إضافة خيار
                </Button>
              </Box>
            </Box>
          ))}
          
          <Button 
            startIcon={<AddIcon />} 
            onClick={addQuestion}
            variant="outlined"
            disabled={isSubmitting}
          >
            إضافة سؤال
          </Button>
          
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            size="large"
            disabled={isSubmitting}
            sx={{
              background: isSubmitting ? 'rgba(0,0,0,0.12)' : 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
              '&:hover': {
                background: isSubmitting ? 'rgba(0,0,0,0.12)' : 'linear-gradient(90deg, #5a0fb5 0%, #1e5fda 100%)'
              }
            }}
          >
            {isSubmitting ? '⏳ جاري الحفظ...' : '📤 حفظ الكويز'}
          </Button>
        </Stack>
      </Box>
    {/* Snackbar for messages */}
    <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({...s, open: false}))} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
      <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbar(s => ({...s, open: false}))} severity={snackbar.severity} sx={{ width: '100%' }}>
        {snackbar.message}
      </MuiAlert>
    </Snackbar>
    </Paper>
  );
};

export default CreateQuiz;