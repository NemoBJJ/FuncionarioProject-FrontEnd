import React from 'react';
import { Link } from 'react-router-dom';
import {
  Database,
  ChartColumn,
  Wallet,
  Users,
  ScanFace,
  ClipboardList,
  CalendarRange
} from 'lucide-react';
import './Menu.css';

const Menu = () => {
  return (
    <div className="rh-home">
      <div className="rh-hero">
        <span className="rh-badge">GesteX</span>
        <h1>RECURSOS HUMANOS</h1>
        <p></p>
      </div>

      <div className="rh-cards">
        <Link to="/database" className="rh-card">
          <div className="card-icon">
            <Database size={48} strokeWidth={2} />
          </div>
          <h2>Banco de Dados</h2>
          <p></p>
          <span>Acessar →</span>
        </Link>

        <Link to="/dashboard-rh" className="rh-card">
          <div className="card-icon">
            <ChartColumn size={48} strokeWidth={2} />
          </div>
          <h2>Indicadores RH</h2>
          <p></p>
          <span>Acessar →</span>
        </Link>

        <Link to="/gestao-salarial" className="rh-card">
          <div className="card-icon">
            <Wallet size={48} strokeWidth={2} />
          </div>
          <h2>Gestão Salarial</h2>
          <p></p>
          <span>Acessar →</span>
        </Link>

        <Link to="/gerenciar-funcionarios" className="rh-card">
          <div className="card-icon">
            <Users size={48} strokeWidth={2} />
          </div>
          <h2>Gerenciar Funcionários</h2>
          <p></p>
          <span>Acessar →</span>
        </Link>

        <Link to="/cadastro-facial" className="rh-card">
          <div className="card-icon">
            <ScanFace size={48} strokeWidth={2} />
          </div>
          <h2>Cadastro Facial</h2>
          <p></p>
          <span>Acessar →</span>
        </Link>

        <Link to="/historico-ponto" className="rh-card">
          <div className="card-icon">
            <ClipboardList size={48} strokeWidth={2} />
          </div>
          <h2>Histórico de Ponto</h2>
          <p></p>
          <span>Acessar →</span>
        </Link>

        <Link to="/agenda" className="rh-card">
          <div className="card-icon">
            <CalendarRange size={48} strokeWidth={2} />
          </div>
          <h2>Agenda do RH</h2>
          <p></p>
          <span>Acessar →</span>
        </Link>
      </div>
    </div>
  );
};

export default Menu;