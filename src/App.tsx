import { Routes, Route } from 'react-router-dom';
import RequireAuth from './HOC/RequireAuth';
import Login from './pages/Login';
import DashboardLayout from './pages/DashboardSideBar';
import QuizzesList from './pages/QuizzesList';
import Announcements from './pages/Announcements';
import CreateQuiz from './pages/CreateQuiz';
import Courses from './pages/Courses';
import GradeBook from './pages/GradeBook';  
import Performance from './pages/Performance';
import Schedule from './pages/Schedule';
import DashboardHome from './pages/DashboardHome';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route path="quizzes" element={<QuizzesList />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="create-quiz" element={<CreateQuiz />} />
        <Route path="courses" element={<Courses />} />
         <Route path="gradebook" element={<GradeBook />} />
        <Route path="performance" element={<Performance />} />
        <Route path="schedule" element={<Schedule />} />
        <Route index element={<DashboardHome />} />

      </Route>
    </Routes>
  );
}

export default App;
