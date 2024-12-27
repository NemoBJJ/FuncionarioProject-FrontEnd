import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Transactions from './components/Transactions';
import Dashboard from './components/Dashboard';
import Statistics from './components/Statistics'; // Adicionado aqui também

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/statistics" element={<Statistics />} /> {/* Certifique-se de incluir Statistics */}
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
