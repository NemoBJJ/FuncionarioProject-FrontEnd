import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import DatabaseRH from './components/DatabaseRH';
import DashboardRH from './components/DashboardRH';
import GestaoSalarial from './components/GestaoSalarial';
import GerenciarFuncionarios from './components/GerenciarFuncionarios';
import ReconhecimentoFacial from './components/ReconhecimentoFacial';
import CadastroFacial from './components/CadastroFacial';
import HistoricoPonto from './components/HistoricoPonto';
import AgendaEventos from './components/AgendaEventos';
import './App.css';

function App() {
  const [showFaceModal, setShowFaceModal] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <button 
          className="face-float-button"
          onClick={() => setShowFaceModal(true)}
          title="Reconhecimento Facial para Ponto"
        >
          📸
        </button>

        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/database" element={<DatabaseRH />} />
          <Route path="/dashboard-rh" element={<DashboardRH />} />
          <Route path="/gestao-salarial" element={<GestaoSalarial />} />
          <Route path="/gerenciar-funcionarios" element={<GerenciarFuncionarios />} />
          <Route path="/cadastro-facial" element={<CadastroFacial />} />
          <Route path="/historico-ponto" element={<HistoricoPonto />} />
          <Route path="/agenda" element={<AgendaEventos />} />
        </Routes>

        {showFaceModal && (
          <ReconhecimentoFacial 
            onClose={() => setShowFaceModal(false)}
            onSucesso={(dados) => {
              console.log('Ponto registrado:', dados);
              setShowFaceModal(false);
            }}
          />
        )}
      </div>
    </Router>
  );
}

export default App;