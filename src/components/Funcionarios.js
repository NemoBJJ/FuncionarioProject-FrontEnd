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

export default Funcionarios;
