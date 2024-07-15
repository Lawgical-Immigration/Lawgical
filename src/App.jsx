import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeListPage from './pages/EmployeeListPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={EmployeeListPage} />
      </Routes>
    </Router>
  );
}
