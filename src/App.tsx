import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context';
import { ErrorBoundary } from './presentation/components/ErrorBoundary';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import MovieDetailsPage from './pages/MovieDetailsPage';

/**
 * App Component
 * Root component with router configuration and context providers
 * Uses custom hooks with DIContainer for state management
 * Uses multiple specialized contexts for state management
 *
 * @architecture Protected by ErrorBoundary to catch render errors
 */
function App() {
  return (
    <ErrorBoundary context={{ component: 'App', source: 'root' }}>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
          </Routes>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
