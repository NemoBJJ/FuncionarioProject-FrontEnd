import React, { useEffect, useState } from 'react';
import api from '../api';
import './Funcionarios.css';

const Funcionarios = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        api.get(`/funcionarios?page=${page}&size=10`)
            .then((response) => setFuncionarios(response.data.content))
            .catch((error) => console.error('Erro ao carregar funcionários', error));
    }, [page]);

    return (
        <div className="funcionarios-container">
            <h1 className="funcionarios-title">Lista de Funcionários</h1>
            <ul className="funcionarios-list">
                {funcionarios.map((func) => (
                    <li key={func.id}>
                        <span>{func.nome}</span>
                        <span>{func.cargo}</span>
                    </li>
                ))}
            </ul>
            <div className="pagination-buttons">
                <button onClick={() => setPage(page - 1)} disabled={page === 0}>
                    Página Anterior
                </button>
                <button onClick={() => setPage(page + 1)}>
                    Próxima Página
                </button>
            </div>
        </div>
    );
};

export default Funcionarios; - ..funcionarios-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.funcionarios-title {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
}

.funcionarios-list {
    list-style-type: none;
    padding: 0;
    width: 100%;
}

.funcionarios-list li {
    background-color: #fff;
    margin: 5px 0;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
}

.pagination-buttons {
    margin-top: 20px;
    display: flex;
    gap: 10px;
}

.pagination-buttons button {
    padding: 10px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.pagination-buttons button:hover {
    background-color: #0056b3;
}

.pagination-buttons button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
