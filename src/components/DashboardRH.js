import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    ArrowLeft,
    Building,
    Users,
    DollarSign,
    Coins,
    BarChart3,
    PieChart,
    Gift,
    PartyPopper,
} from 'lucide-react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const DashboardRH = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalFuncionarios: 0,
        salarioMedio: 0,
        totalSalarios: 0,
        homens: 0,
        mulheres: 0,
        departamentos: 0,
        cargos: 0,
    });
    const [cargosData, setCargosData] = useState({ labels: [], counts: [] });
    const [departamentosData, setDepartamentosData] = useState({ labels: [], salaries: [] });
    const [aniversariantes, setAniversariantes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/funcionarios?size=100');
                const data = response.data.content || [];
                setFuncionarios(data);

                // Estatísticas básicas
                const total = data.length;
                const salarios = data.map(f => f.salario || 0);
                const totalSalarios = salarios.reduce((acc, s) => acc + s, 0);
                const salarioMedio = total > 0 ? totalSalarios / total : 0;
                const homens = data.filter(f => f.sexo?.toUpperCase() === 'MASCULINO' || f.sexo === 'M').length;
                const mulheres = data.filter(f => f.sexo?.toUpperCase() === 'FEMININO' || f.sexo === 'F').length;
                const departamentosUnicos = new Set(data.map(f => f.departamento).filter(Boolean));
                const cargosUnicos = new Set(data.map(f => f.cargo).filter(Boolean));

                setStats({
                    totalFuncionarios: total,
                    salarioMedio: salarioMedio,
                    totalSalarios: totalSalarios,
                    homens: homens,
                    mulheres: mulheres,
                    departamentos: departamentosUnicos.size,
                    cargos: cargosUnicos.size,
                });

                // Dados para gráfico de cargos (top 6)
                const cargoCount = {};
                data.forEach(f => {
                    if (f.cargo) {
                        cargoCount[f.cargo] = (cargoCount[f.cargo] || 0) + 1;
                    }
                });
                const sortedCargos = Object.entries(cargoCount).sort((a, b) => b[1] - a[1]);
                const topCargos = sortedCargos.slice(0, 6);
                setCargosData({
                    labels: topCargos.map(c => c[0]),
                    counts: topCargos.map(c => c[1]),
                });

                // Dados para gráfico de salários por departamento (top 6)
                const deptSalario = {};
                data.forEach(f => {
                    if (f.departamento && f.salario) {
                        deptSalario[f.departamento] = (deptSalario[f.departamento] || 0) + f.salario;
                    }
                });
                const sortedDepts = Object.entries(deptSalario).sort((a, b) => b[1] - a[1]);
                const topDepts = sortedDepts.slice(0, 6);
                setDepartamentosData({
                    labels: topDepts.map(d => d[0]),
                    salaries: topDepts.map(d => d[1]),
                });

                // Aniversariantes do mês atual e próximos
                const hoje = new Date();
                const mesAtual = hoje.getMonth();
                const aniversariantesList = data
                    .filter(f => {
                        if (!f.dataNascimento) return false;
                        const dataNasc = new Date(f.dataNascimento);
                        const mesNasc = dataNasc.getMonth();
                        const diffMeses = (mesNasc - mesAtual + 12) % 12;
                        return diffMeses <= 2;
                    })
                    .sort((a, b) => {
                        const mesA = new Date(a.dataNascimento).getMonth();
                        const mesB = new Date(b.dataNascimento).getMonth();
                        return mesA - mesB;
                    })
                    .slice(0, 5);
                setAniversariantes(aniversariantesList);

            } catch (error) {
                console.error('Erro ao carregar dados do dashboard RH:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value || 0);
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    // Gráfico de Cargos
    const cargoChartData = {
        labels: cargosData.labels,
        datasets: [
            {
                label: 'Funcionários',
                data: cargosData.counts,
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: '#22c55e',
                borderWidth: 1,
                borderRadius: 8,
            },
        ],
    };

    // Gráfico de Salários por Departamento
    const deptChartData = {
        labels: departamentosData.labels,
        datasets: [
            {
                label: 'Total de Salários (R$)',
                data: departamentosData.salaries,
                backgroundColor: 'rgba(251, 191, 36, 0.7)',
                borderColor: '#fbbf24',
                borderWidth: 1,
                borderRadius: 8,
            },
        ],
    };

    // Gráfico de pizza (Homens x Mulheres)
    const genderData = {
        labels: ['Homens', 'Mulheres', 'Não informado'],
        datasets: [
            {
                data: [stats.homens, stats.mulheres, stats.totalFuncionarios - stats.homens - stats.mulheres],
                backgroundColor: ['#3b82f6', '#ec4899', '#64748b'],
                borderColor: ['#1e40af', '#9d174d', '#475569'],
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#cbd5e1', font: { size: 11 } },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        let value = context.raw || 0;
                        if (context.dataset.label?.includes('Salário')) {
                            return `${context.dataset.label}: ${formatCurrency(value)}`;
                        }
                        return `${context.dataset.label}: ${value}`;
                    },
                },
            },
        },
        scales: {
            y: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(148, 163, 184, 0.1)' },
                beginAtZero: true,
            },
            x: {
                ticks: { color: '#94a3b8', rotation: 45, maxRotation: 45 },
                grid: { color: 'rgba(148, 163, 184, 0.1)' },
            },
        },
    };

    const genderOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#f8fafc', font: { size: 11 } },
            },
        },
    };

    if (loading) {
        return (
            <div className="dashboard-rh-loading">
                <p>Carregando dashboard RH...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-rh-container">
            <div className="dashboard-rh-header">
                <Link to="/">
                    <button className="back-button-dashboard-rh">
                        <ArrowLeft size={18} className="icon-back" />
                        Voltar ao Menu
                    </button>
                </Link>
                <h1>
                    <Building size={28} className="icon-header" />
                    Dashboard RH
                </h1>
            </div>

            {/* Cards de métricas */}
            <div className="metrics-grid-rh">
                <div className="metric-card-rh total-card">
                    <div className="metric-icon-rh">
                        <Users size={32} className="icon-metric" />
                    </div>
                    <div className="metric-info-rh">
                        <span className="metric-label-rh">Total Funcionários</span>
                        <span className="metric-value-rh">{stats.totalFuncionarios}</span>
                    </div>
                </div>

                <div className="metric-card-rh salary-card">
                    <div className="metric-icon-rh">
                        <DollarSign size={32} className="icon-metric" />
                    </div>
                    <div className="metric-info-rh">
                        <span className="metric-label-rh">Salário Médio</span>
                        <span className="metric-value-rh">{formatCurrency(stats.salarioMedio)}</span>
                    </div>
                </div>

                <div className="metric-card-rh payroll-card">
                    <div className="metric-icon-rh">
                        <Coins size={32} className="icon-metric" />
                    </div>
                    <div className="metric-info-rh">
                        <span className="metric-label-rh">Folha Mensal</span>
                        <span className="metric-value-rh">{formatCurrency(stats.totalSalarios)}</span>
                    </div>
                </div>

                <div className="metric-card-rh dept-card">
                    <div className="metric-icon-rh">
                        <Building size={32} className="icon-metric" />
                    </div>
                    <div className="metric-info-rh">
                        <span className="metric-label-rh">Departamentos</span>
                        <span className="metric-value-rh">{stats.departamentos}</span>
                    </div>
                </div>
            </div>

            {/* Gráficos principais */}
            <div className="charts-row-rh">
                <div className="chart-card-rh">
                    <h3>
                        <BarChart3 size={20} className="icon-title" />
                        Funcionários por Cargo
                    </h3>
                    <div className="chart-wrapper-rh">
                        {cargosData.labels.length > 0 ? (
                            <Bar data={cargoChartData} options={chartOptions} />
                        ) : (
                            <div className="no-data-rh">Sem dados para exibir</div>
                        )}
                    </div>
                </div>

                <div className="chart-card-rh">
                    <h3>
                        <DollarSign size={20} className="icon-title" />
                        Total de Salários por Departamento
                    </h3>
                    <div className="chart-wrapper-rh">
                        {departamentosData.labels.length > 0 ? (
                            <Bar data={deptChartData} options={chartOptions} />
                        ) : (
                            <div className="no-data-rh">Sem dados para exibir</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="charts-row-rh">
                <div className="chart-card-rh donut-card">
                    <h3>
                        <PieChart size={20} className="icon-title" />
                        Proporção por Gênero
                    </h3>
                    <div className="donut-wrapper-rh">
                        <Doughnut data={genderData} options={genderOptions} />
                    </div>
                </div>

                <div className="chart-card-rh birthday-card">
                    <h3>
                        <Gift size={20} className="icon-title" />
                        Próximos Aniversariantes
                    </h3>
                    <div className="birthday-list">
                        {aniversariantes.length > 0 ? (
                            aniversariantes.map((f, idx) => (
                                <div key={f.id} className="birthday-item">
                                    <div className="birthday-avatar">
                                        <PartyPopper size={24} className="icon-birthday" />
                                    </div>
                                    <div className="birthday-info">
                                        <span className="birthday-name">{f.nome}</span>
                                        <span className="birthday-date">
                                            {f.dataNascimento ? new Date(f.dataNascimento).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }) : '-'}
                                        </span>
                                    </div>
                                    <div className="birthday-cargo">{f.cargo || '-'}</div>
                                </div>
                            ))
                        ) : (
                            <div className="no-data-rh">Nenhum aniversariante nos próximos meses</div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .dashboard-rh-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                    padding: 2rem;
                }

                .dashboard-rh-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .dashboard-rh-header h1 {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 2rem;
                    font-weight: bold;
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                .icon-back {
                    color: #f8fafc;
                    stroke-width: 2;
                    margin-right: 0.3rem;
                    vertical-align: middle;
                }

                .icon-header {
                    color: #fbbf24;
                    stroke-width: 2;
                }

                .icon-title {
                    color: #fbbf24;
                    stroke-width: 2;
                    margin-right: 0.4rem;
                    vertical-align: middle;
                }

                .icon-metric {
                    stroke-width: 2;
                }

                .icon-birthday {
                    color: #fbbf24;
                    stroke-width: 2;
                }

                .back-button-dashboard-rh {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.5rem 1.25rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #f8fafc;
                    background: rgba(100, 116, 139, 0.3);
                    border: 1px solid rgba(255, 193, 7, 0.5);
                    border-radius: 9999px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .back-button-dashboard-rh:hover {
                    background: rgba(255, 193, 7, 0.2);
                    border-color: #fbbf24;
                    transform: translateX(-4px);
                }

                /* Cards de métricas */
                .metrics-grid-rh {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .metric-card-rh {
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    border: 1px solid rgba(255, 193, 7, 0.2);
                    transition: transform 0.2s ease, border-color 0.2s ease;
                }

                .metric-card-rh:hover {
                    transform: translateY(-4px);
                    border-color: rgba(255, 193, 7, 0.5);
                }

                .metric-icon-rh {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 3.5rem;
                    height: 3.5rem;
                    border-radius: 50%;
                    background: rgba(255, 193, 7, 0.1);
                }

                .total-card .metric-icon-rh { color: #fbbf24; }
                .salary-card .metric-icon-rh { color: #22c55e; }
                .payroll-card .metric-icon-rh { color: #3b82f6; }
                .dept-card .metric-icon-rh { color: #ec4899; }

                .metric-info-rh {
                    display: flex;
                    flex-direction: column;
                }

                .metric-label-rh {
                    font-size: 0.875rem;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .metric-value-rh {
                    font-size: 1.75rem;
                    font-weight: bold;
                    color: #f8fafc;
                }

                .total-card .metric-value-rh { color: #fbbf24; }
                .salary-card .metric-value-rh { color: #22c55e; }
                .payroll-card .metric-value-rh { color: #3b82f6; }
                .dept-card .metric-value-rh { color: #ec4899; }

                /* Gráficos */
                .charts-row-rh {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                }

                .chart-card-rh {
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    border: 1px solid rgba(255, 193, 7, 0.2);
                }

                .chart-card-rh h3 {
                    display: flex;
                    align-items: center;
                    color: #f8fafc;
                    font-size: 1.125rem;
                    margin-bottom: 1rem;
                    border-left: 4px solid #fbbf24;
                    padding-left: 0.75rem;
                }

                .chart-wrapper-rh {
                    height: 300px;
                }

                .donut-wrapper-rh {
                    height: 250px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                /* Aniversariantes */
                .birthday-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .birthday-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.75rem;
                    background: rgba(30, 41, 59, 0.4);
                    border-radius: 0.75rem;
                    transition: all 0.2s ease;
                }

                .birthday-item:hover {
                    background: rgba(30, 41, 59, 0.6);
                    transform: translateX(4px);
                }

                .birthday-avatar {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 50%;
                    background: rgba(251, 191, 36, 0.15);
                }

                .birthday-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .birthday-name {
                    font-weight: 600;
                    color: #f8fafc;
                }

                .birthday-date {
                    font-size: 0.75rem;
                    color: #94a3b8;
                }

                .birthday-cargo {
                    font-size: 0.75rem;
                    color: #fbbf24;
                }

                .no-data-rh {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #94a3b8;
                    font-size: 0.875rem;
                }

                .dashboard-rh-loading {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                    color: #f8fafc;
                }

                @media (max-width: 768px) {
                    .dashboard-rh-container {
                        padding: 1rem;
                    }
                    .dashboard-rh-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .charts-row-rh {
                        grid-template-columns: 1fr;
                    }
                    .chart-wrapper-rh {
                        height: 250px;
                    }
                }
            `}</style>
        </div>
    );
};

export default DashboardRH;