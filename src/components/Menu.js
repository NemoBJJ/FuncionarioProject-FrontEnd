import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

const Menu = () => {
  return (
    <div className="menu-container">
      <h1 className="menu-title">Recursos Humanos</h1>
      <div className="menu-grid">
        
        <Link to="/database" className="menu-item">
          <div className="menu-icon">🗄️</div>
          <span>Banco de Dados</span>
        </Link>

        <Link to="/dashboard-rh" className="menu-item">
          <div className="menu-icon">📈</div>
          <span>Dashboard RH</span>
        </Link>

        <Link to="/gestao-salarial" className="menu-item">
          <div className="menu-icon">💰</div>
          <span>Gestão Salarial</span>
        </Link>

        <Link to="/gerenciar-funcionarios" className="menu-item">
          <div className="menu-icon">⚙️</div>
          <span>Gerenciar Funcionários</span>
        </Link>

        <Link to="/cadastro-facial" className="menu-item">
          <div className="menu-icon">😀</div>
          <span>Cadastro Facial</span>
        </Link>

        <Link to="/historico-ponto" className="menu-item">
          <div className="menu-icon">📋</div>
          <span>Histórico de Ponto</span>
        </Link>

        <Link to="/agenda" className="menu-item">
          <div className="menu-icon">📅</div>
          <span>Agenda do RH</span>
        </Link>

      </div>
    </div>
  );
};

export default Menu;   -