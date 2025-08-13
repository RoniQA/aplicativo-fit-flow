import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import WorkoutForm from './components/WorkoutForm';
import MealForm from './components/MealForm';
import Progress from './components/Progress';
import Tips from './components/Tips';
import Navigation from './components/Navigation';
import { useUser } from './contexts/UserContext';

function AppRoutes() {
  const { user } = useUser();

  if (!user) {
    return <Welcome />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workout" element={<WorkoutForm />} />
        <Route path="/meal" element={<MealForm />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Navigation />
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
