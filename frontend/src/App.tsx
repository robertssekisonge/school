import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Activities from './components/sections/Activities';
import Teachers from './components/sections/Teachers';
import Facilities from './components/sections/Facilities';
import Testimonials from './components/sections/Testimonials';
import Contact from './components/sections/Contact';
import LoginForm from './components/LoginForm';
import AdminPanel from './components/admin/AdminPanel';
import Sponsorship from './components/pages/Sponsorship';
import ParentsPortal from './components/pages/ParentsPortal';
import DebugPage from './components/DebugPage';
import ErrorBoundary from './components/ErrorBoundary';


function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ContentProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <Routes>
                <Route path="/" element={
                  <>
                    <Header />
                    <main>
                      <Hero />
                      <About />
                      <Activities />
                      <Teachers />
                      <Facilities />
                      <Testimonials />
                      <Contact />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
                <Route path="/debug" element={<DebugPage />} />
                <Route path="/sponsorship" element={<Sponsorship />} />
                <Route path="/parents" element={<ParentsPortal />} />
              </Routes>
            </div>
          </Router>
        </ContentProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;