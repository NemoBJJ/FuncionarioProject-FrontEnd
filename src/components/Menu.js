import React from 'react';
import './Menu.css';

const Menu = () => {
    return (
        <div className="menu-container">
            <h1 className="menu-title">Sistema de Gerenciamento de Funcionários</h1>
            <div className="menu-grid">
                {/* Link para Banco de Dados Completo Paginado */}
                <a
                    href="http://localhost:8082/funcionarios-html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-item"
                >
                    <div className="menu-icon">📂</div>
                    <span>Banco de Dados Completo</span>
                </a>

                {/* Link para Dashboard */}
                <a
                    href="http://localhost:8082/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-item"
                >
                    <div className="menu-icon">📈</div>
                    <span>Dashboard</span>
                </a>

                {/* Link para Funcionários/Cargo */}
                <a
                    href="http://localhost:8082/exportacao/relatorios/cargos/csv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-item"
                >
                    <div className="menu-icon">📋</div>
                    <span>Funcionários/Cargo</span>
                </a>

                {/* Link para Total Salários/Departamentos */}
                <a
                    href="http://localhost:8082/exportacao/relatorios/departamentos/csv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-item"
                >
                    <div className="menu-icon">🏢</div>
                    <span>Total Salários/Departamentos</span>
                </a>

                {/* Link para Funcionário/Salário Paginado */}
                <a
                    href="http://localhost:8082/funcionarios-html/salarios"
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
