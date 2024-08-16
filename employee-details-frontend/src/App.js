import React from 'react';
import './css/App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeList from './pages/EmployeeList'; // Make sure the path is correct
import UploadPage from './pages/UploadPage'; // Make sure the path is correct
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Dashboard/>} />
                <Route path="/employeelist" element={<EmployeeList />} />
                <Route path="/upload/:id" element={<UploadPage />} />
                <Route path="*" element={<h2>404 - Page Not Found</h2>} />
            </Routes>
        </Router>
    );
}

export default App;
