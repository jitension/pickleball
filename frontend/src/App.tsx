import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import AuthCallback from './pages/AuthCallback';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Polls from './pages/Polls';
import ProtectedRoute from './components/ProtectedRoute';
import Competition from './pages/Competition';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/polls"
            element={
              <ProtectedRoute>
                <Polls />
              </ProtectedRoute>
            }
          />
          <Route
            path="/competition"
            element={
              <ProtectedRoute>
                <Competition />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
