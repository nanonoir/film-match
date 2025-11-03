import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context';
import Login from './pages/Login';
import Home from './pages/Home';
import MovieDetailsPage from './pages/MovieDetailsPage';

/**
 * App Component
 * Root component with router configuration and context providers
 * Uses custom hooks with DIContainer for state management
 * Uses multiple specialized contexts for state management
 */
function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
