import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  BarChart3, 
  DollarSign, 
  Settings, 
  Smile, 
  ClipboardList, 
  Calendar, 
  Camera 
} from 'lucide-react';
import ReconhecimentoFacial from './ReconhecimentoFacial';
import './Menu.css';

const Menu = () => {
  const [showFaceModal, setShowFaceModal] = useState(false);

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1 className="menu-title">Recursos Humanos</h1>
        <button 
          className="camera-button"
          onClick={() => setShowFaceModal(true)}
          title="Cadastro Facial / Ponto"
        >
          <Camera size={28} />
        </button>
      </div>

      <div className="menu-grid">
        <Link to="/database" className="menu-item">
          <Database size={32} className="menu-icon" />
          <span>Banco de Dados</span>
        </Link>

        <Link to="/dashboard-rh" className="menu-item">
          <BarChart3 size={32} className="menu-icon" />
          <span>Dashboard RH</span>
        </Link>

        <Link to="/gestao-salarial" className="menu-item">
          <DollarSign size={32} className="menu-icon" />
          <span>Gestão Salarial</span>
        </Link>

        <Link to="/gerenciar-funcionarios" className="menu-item">
          <Settings size={32} className="menu-icon" />
          <span>Gerenciar Funcionários</span>
        </Link>

        <Link to="/cadastro-facial" className="menu-item">
          <Smile size={32} className="menu-icon" />
          <span>Cadastro Facial</span>
        </Link>

        <Link to="/historico-ponto" className="menu-item">
          <ClipboardList size={32} className="menu-icon" />
          <span>Histórico de Ponto</span>
        </Link>

        <Link to="/agenda" className="menu-item">
          <Calendar size={32} className="menu-icon" />
          <span>Agenda do RH</span>
        </Link>
      </div>

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
  );
};

export default Menu;