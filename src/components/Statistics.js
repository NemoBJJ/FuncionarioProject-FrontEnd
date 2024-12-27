import React, { useEffect, useState } from 'react';
import api from '../api';
import './Statistics.css';

const Statistics = () => {
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await api.get('/dashboard/statistics'); // Rota correta para estatísticas
                setStatistics(response.data);
            } catch (error) {
                console.error('Erro ao buscar estatísticas:', error);
            }
        };
        fetchStatistics();
    }, []);

    if (!statistics) {
        return <p>Carregando estatísticas...</p>;
    }

    return (
        <div className="statistics-container">
            <h2>Estatísticas Financeiras</h2>
            <div className="statistics-grid">
                {/* Total de Receitas e Despesas */}
                <div className="stat-item receita">
                    <h3>Total de Receitas</h3>
                    <p>R$ {statistics.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="stat-item despesa">
                    <h3>Total de Despesas</h3>
                    <p>R$ {statistics.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>

                {/* Médias Mensais */}
                <div className="stat-item receita">
                    <h3>Média Mensal de Receitas</h3>
                    <p>R$ {statistics.mediaReceitasMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="stat-item despesa">
                    <h3>Média Mensal de Despesas</h3>
                    <p>R$ {statistics.mediaDespesasMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>

                {/* Mediana */}
                <div className="stat-item receita">
                    <h3>Mediana das Receitas</h3>
                    <p>R$ {statistics.medianaReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="stat-item despesa">
                    <h3>Mediana das Despesas</h3>
                    <p>R$ {statistics.medianaDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>

                {/* Moda */}
                <div className="stat-item receita">
                    <h3>Moda das Receitas</h3>
                    <p>R$ {statistics.modaReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="stat-item despesa">
                    <h3>Moda das Despesas</h3>
                    <p>R$ {statistics.modaDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>

                {/* Desvio Padrão */}
                <div className="stat-item receita">
                    <h3>Desvio Padrão das Receitas</h3>
                    <p>R$ {statistics.desvioPadraoReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="stat-item despesa">
                    <h3>Desvio Padrão das Despesas</h3>
                    <p>R$ {statistics.desvioPadraoDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
            </div>

            {/* Botão de Voltar */}
            <div className="back-to-menu">
                <a href="/">
                    <button className="back-button">Voltar ao Menu</button>
                </a>
            </div>
        </div>
    );
};

export default Statistics;
