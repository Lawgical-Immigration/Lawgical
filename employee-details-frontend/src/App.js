import React from 'react';
import './css/App.css'
import './css/tailwind.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeList from './pages/EmployeeList';
import UploadPage from './pages/UploadPage'; 
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmployeeList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload/:id" element={<UploadPage />} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
