import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderOpen, BarChart3, ClipboardList, Building2, 
  DollarSign, Smile, Calendar, Camera 
} from 'lucide-react';
import ReconhecimentoFacial from './ReconhecimentoFacial';
import './Menu.css';

const API_BASE_URL = 'http://localhost:8082';

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
        <a
          href={`${API_BASE_URL}/funcionarios-html`}
          target="_blank"
          rel="noopener noreferrer"
          className="menu-item"
        >
          <FolderOpen size={32} className="menu-icon" />
          <span>Banco de Dados Completo</span>
        </a>

        <a
          href={`${API_BASE_URL}/dashboard`}
          target="_blank"
          rel="noopener noreferrer"
          className="menu-item"
        >
          <BarChart3 size={32} className="menu-icon" />
          <span>Dashboard</span>
        </a>

        <a
          href={`${API_BASE_URL}/exportacao/relatorios/cargos/csv`}
          target="_blank"
          rel="noopener noreferrer"
          className="menu-item"
        >
          <ClipboardList size={32} className="menu-icon" />
          <span>Funcionários/Cargo</span>
        </a>

        <a
          href={`${API_BASE_URL}/exportacao/relatorios/departamentos/csv`}
          target="_blank"
          rel="noopener noreferrer"
          className="menu-item"
        >
          <Building2 size={32} className="menu-icon" />
          <span>Total Salários/Departamentos</span>
        </a>

        <a
          href={`${API_BASE_URL}/funcionarios-html/salarios`}
          target="_blank"
          rel="noopener noreferrer"
          className="menu-item"
        >
          <DollarSign size={32} className="menu-icon" />
          <span>Funcionário/Salário</span>
        </a>

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
          <span>Agenda de Eventos</span>
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