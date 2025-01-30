import React from 'react';
import './Menu.css';

// Defina a URL base do backend da AWS
const API_BASE_URL = 'http://44.211.42.105:8082';

const Menu = () => {
    return (
        <div className="menu-container">
            <h1 className="menu-title">Sistema de Gerenciamento de Funcionários</h1>
            <div className="menu-grid">
                {/* Link para Banco de Dados Completo Paginado */}
                <a
                    href={`${API_BASE_URL}/funcionarios-html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-item"
                >
                    <div className="menu-icon">📂</div>
                    <span>Banco de Dados Completo</span>
                </a>

                {/* Link para Dashboard */}
                <a
                    href={`${API_BASE_URL}/dashboard`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-item"
                >
                    <div className="menu-icon">📈</div>
                    <span>Dashboard</span>
                </a>

                {/* Link para Funcionários/Cargo */}
                <a
                    href={`${API_BASE_URL}/exportacao/relatorios/cargos/csv`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-item"
                >
                    <div className="menu-icon">📋</div>
                    <span>Funcionários/Cargo</span>
                </a>

                {/* Link para Total Salários/Departamentos */}
                <a
                    href={`${API_BASE_URL}/exportacao/relatorios/departamentos/csv`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-item"
                >
                    <div className="menu-icon">🏢</div>
                    <span>Total Salários/Departamentos</span>
                </a>

                {/* Link para Funcionário/Salário Paginado */}
                <a
                    href={`${API_BASE_URL}/funcionarios-html/salarios`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-item"
                >
                    <div className="menu-icon">💰</div>
                    <span>Funcionário/Salário</span>
                </a>
            </div>
        </div>
    );
};

export default Menu;
