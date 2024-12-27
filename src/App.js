import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu';
import BancodeDados from './components/BancodeDados';

function App() {
    return (
        <Router>
            <Menu />
            <Routes>
                <Route path="/database" element={<BancodeDados />} />
            </Routes>
        </Router>
    );
}

export default App;
