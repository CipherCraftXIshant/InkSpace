import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import Phase1DevNav from './components/common/Phase1DevNav.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <AuthProvider>
          <ScrollToTop />
          <AppRoutes />
          <Phase1DevNav />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
