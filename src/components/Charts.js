import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Charts = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const mockData = [
            { month: '2024-01', type: 'RECEITA', total: 46253.66 },
            { month: '2024-01', type: 'DESPESA', total: 40098.33 },
            { month: '2024-02', type: 'RECEITA', total: 41271.2 },
            { month: '2024-02', type: 'DESPESA', total: 39153.05 },
            { month: '2024-03', type: 'RECEITA', total: 56421.33 },
            { month: '2024-03', type: 'DESPESA', total: 49657 },
            { month: '2024-04', type: 'RECEITA', total: 63993.89 },
            { month: '2024-04', type: 'DESPESA', total: 38183.55 },
            { month: '2024-05', type: 'RECEITA', total: 63682.74 },
            { month: '2024-05', type: 'DESPESA', total: 59412.71 },
            { month: '2024-06', type: 'RECEITA', total: 63087.86 },
            { month: '2024-06', type: 'DESPESA', total: 43966.68 },
            { month: '2024-07', type: 'RECEITA', total: 35646.52 },
            { month: '2024-07', type: 'DESPESA', total: 58460.26 },
            { month: '2024-08', type: 'RECEITA', total: 49864.72 },
            { month: '2024-08', type: 'DESPESA', total: 52514.67 },
            { month: '2024-09', type: 'RECEITA', total: 47372.66 },
            { month: '2024-09', type: 'DESPESA', total: 39586.16 },
            { month: '2024-10', type: 'RECEITA', total: 47766.66 },
            { month: '2024-10', type: 'DESPESA', total: 66905.28 },
            { month: '2024-11', type: 'RECEITA', total: 50941.87 },
            { month: '2024-11', type: 'DESPESA', total: 58949.38 },
            { month: '2024-12', type: 'RECEITA', total: 69260.05 },
            { month: '2024-12', type: 'DESPESA', total: 67735.18 },
        ];

        // Captura todos os meses presentes nos dados
        const months = [...new Set(mockData.map((d) => d.month))];

        // Calcula receitas e despesas por mês
        const revenues = months.map((month) =>
            mockData
                .filter((d) => d.month === month && d.type === 'RECEITA')
                .reduce((acc, curr) => acc + curr.total, 0)
        );
        const expenses = months.map((month) =>
            mockData
                .filter((d) => d.month === month && d.type === 'DESPESA')
                .reduce((acc, curr) => acc + curr.total, 0)
        );

        // Atualiza o estado do gráfico
        setChartData({
            labels: months,
            datasets: [
                {
                    label: 'Receitas',
                    data: revenues,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Despesas',
                    data: expenses,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
            ],
        });
    }, []);

    return (
        <div style={{ width: '80%', margin: '0 auto', height: '500px' }}>
            <h2>Receitas e Despesas - 2024</h2>
            {chartData ? (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Meses',
                                },
                            },
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Valores (R$)',
                                },
                            },
                        },
                    }}
                />
            ) : (
                <p>Carregando dados ou nenhum dado disponível.</p>
            )}
        </div>
    );
};

export default Charts;
