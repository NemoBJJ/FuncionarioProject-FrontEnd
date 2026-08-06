import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, BarChart3, Search, ClipboardList, ArrowLeft, 
  Eye, X, Bus, Building2, Coffee, Heart, FileText, Info 
} from 'lucide-react';
import api from '../api';

const GestaoSalarial = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [filteredFuncionarios, setFilteredFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchNome, setSearchNome] = useState('');
    const [filtroDepartamento, setFiltroDepartamento] = useState('');
    const [departamentos, setDepartamentos] = useState([]);
    const [relatorioDepartamentos, setRelatorioDepartamentos] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

    const calcularComposicaoSalarial = (salarioBruto) => {
        if (!salarioBruto || salarioBruto <= 0) return null;
        
        const vt = salarioBruto * 0.10;
        const fgts = salarioBruto * 0.08;
        const va = salarioBruto * 0.10;
        const planoSaude = salarioBruto * 0.06;
        const inss = salarioBruto * 0.075;
        
        return {
            salarioBruto,
            vt,
            fgts,
            va,
            planoSaude,
            inss,
            totalEncargos: vt + fgts + va + planoSaude + inss
        };
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/funcionarios?size=1000');
            const data = response.data.content || [];
            setFuncionarios(data);
            setFilteredFuncionarios(data);

            const deptsUnicos = [...new Set(data.map(f => f.departamento).filter(Boolean))];
            setDepartamentos(deptsUnicos.sort());

            const deptSalary = {};
            data.forEach(f => {
                if (f.departamento && f.salario) {
                    deptSalary[f.departamento] = (deptSalary[f.departamento] || 0) + f.salario;
                }
            });
            setRelatorioDepartamentos(Object.entries(deptSalary).map(([depto, total]) => ({ depto, total })));

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const aplicarFiltros = () => {
        let filtered = [...funcionarios];
        if (searchNome) {
            filtered = filtered.filter(f => 
                f.nome?.toLowerCase().includes(searchNome.toLowerCase())
            );
        }
        if (filtroDepartamento) {
            filtered = filtered.filter(f => f.departamento === filtroDepartamento);
        }
        setFilteredFuncionarios(filtered);
    };

    useEffect(() => {
        aplicarFiltros();
    }, [searchNome, filtroDepartamento]);

    const limparFiltros = () => {
        setSearchNome('');
        setFiltroDepartamento('');
    };

    const abrirModal = (funcionario) => {
        setFuncionarioSelecionado(funcionario);
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setFuncionarioSelecionado(null);
    };

    const formatCurrency = (value) => {
        if (!value) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('pt-BR');
    };

    if (loading) {
        return (
            <div className="gestao-loading">
                <p>Carregando dados...</p>
            </div>
        );
    }

    return (
        <div className="gestao-container">
            <div className="gestao-header">
                <Link to="/">
                    <button className="back-button-gestao">
                        <ArrowLeft size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        Voltar ao Menu
                    </button>
                </Link>
                <h1>
                    <DollarSign size={28} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                    Gestão Salarial
                </h1>
            </div>

            {/* Cards de Resumo por Departamento */}
            <div className="resumo-cards">
                <div className="resumo-card">
                    <h3>
                        <BarChart3 size={20} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                        Resumo por Departamento
                    </h3>
                    <div className="resumo-lista">
                        {relatorioDepartamentos.slice(0, 6).map((item, idx) => (
                            <div key={idx} className="resumo-item">
                                <span className="resumo-nome">{item.depto}</span>
                                <span className="resumo-valor">{formatCurrency(item.total)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filtros - CENTRALIZADO */}
            <div className="filtros-card">
                <h3>
                    <Search size={20} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                    Filtros
                </h3>
                <div className="filtros-row" style={{ justifyContent: 'center' }}>
                    <div className="filtro-group">
                        <label>Funcionário:</label>
                        <input
                            type="text"
                            placeholder="Digite o nome..."
                            value={searchNome}
                            onChange={(e) => setSearchNome(e.target.value)}
                        />
                    </div>
                    <div className="filtro-group">
                        <label>Departamento:</label>
                        <select value={filtroDepartamento} onChange={(e) => setFiltroDepartamento(e.target.value)}>
                            <option value="">Todos</option>
                            {departamentos.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <button className="btn-limpar" onClick={limparFiltros}>Limpar</button>
                </div>
            </div>

            {/* Tabela de Funcionários */}
            <div className="tabela-card">
                <h3>
                    <ClipboardList size={20} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                    Funcionários
                </h3>
                <div className="tabela-wrapper">
                    <table className="tabela-gestao">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Cargo</th>
                                <th>Salário Bruto</th>
                                <th>Departamento</th>
                                <th>Admissão</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFuncionarios.map((f) => (
                                <tr key={f.id}>
                                    <td>{f.id}</td>
                                    <td><strong>{f.nome || '-'}</strong></td>
                                    <td>{f.cargo || '-'}</td>
                                    <td>{formatCurrency(f.salario)}</td>
                                    <td>{f.departamento || '-'}</td>
                                    <td>{formatDate(f.dataAdmissao)}</td>
                                    <td>
                                        <button 
                                            className="btn-detalhar"
                                            onClick={() => abrirModal(f)}
                                        >
                                            <Eye size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                            Detalhar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredFuncionarios.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="sem-dados">Nenhum funcionário encontrado</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {modalAberto && funcionarioSelecionado && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <BarChart3 size={20} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                                Detalhamento Salarial - {funcionarioSelecionado.nome}
                            </h3>
                            <button className="modal-fechar" onClick={fecharModal}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="info-funcionario">
                                <div><strong>ID:</strong> {funcionarioSelecionado.id}</div>
                                <div><strong>Cargo:</strong> {funcionarioSelecionado.cargo || '-'}</div>
                                <div><strong>Departamento:</strong> {funcionarioSelecionado.departamento || '-'}</div>
                                <div><strong>Data Admissão:</strong> {formatDate(funcionarioSelecionado.dataAdmissao)}</div>
                            </div>
                            
                            {(() => {
                                const c = calcularComposicaoSalarial(funcionarioSelecionado.salario);
                                if (!c) return <p className="sem-dados">Salário não disponível</p>;
                                
                                return (
                                    <div className="composicao">
                                        <h4>Composição do Salário</h4>
                                        <div className="composicao-grid">
                                            <div className="composicao-linha header">
                                                <span>Componente</span>
                                                <span>Percentual</span>
                                                <span>Valor</span>
                                            </div>
                                            <div className="composicao-linha">
                                                <span><DollarSign size={16} style={{ display: 'inline', marginRight: '4px' }} /> Salário Bruto</span>
                                                <span>100%</span>
                                                <span className="valor-bruto">{formatCurrency(c.salarioBruto)}</span>
                                            </div>
                                            <div className="composicao-linha">
                                                <span><Bus size={16} style={{ display: 'inline', marginRight: '4px' }} /> Vale Transporte (VT)</span>
                                                <span>10%</span>
                                                <span>{formatCurrency(c.vt)}</span>
                                            </div>
                                            <div className="composicao-linha">
                                                <span><Building2 size={16} style={{ display: 'inline', marginRight: '4px' }} /> FGTS (8%)</span>
                                                <span>8%</span>
                                                <span>{formatCurrency(c.fgts)}</span>
                                            </div>
                                            <div className="composicao-linha">
                                                <span><Coffee size={16} style={{ display: 'inline', marginRight: '4px' }} /> Vale Alimentação (VA)</span>
                                                <span>10%</span>
                                                <span>{formatCurrency(c.va)}</span>
                                            </div>
                                            <div className="composicao-linha">
                                                <span><Heart size={16} style={{ display: 'inline', marginRight: '4px' }} /> Plano de Saúde</span>
                                                <span>6%</span>
                                                <span>{formatCurrency(c.planoSaude)}</span>
                                            </div>
                                            <div className="composicao-linha">
                                                <span><FileText size={16} style={{ display: 'inline', marginRight: '4px' }} /> INSS</span>
                                                <span>7,5%</span>
                                                <span>{formatCurrency(c.inss)}</span>
                                            </div>
                                            <div className="composicao-linha total-encargos">
                                                <span><Info size={16} style={{ display: 'inline', marginRight: '4px' }} /> Total de Encargos</span>
                                                <span>{((c.totalEncargos / c.salarioBruto) * 100).toFixed(1)}%</span>
                                                <span>{formatCurrency(c.totalEncargos)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            <style jsx="true">{`
                .gestao-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                    padding: 2rem;
                }
                .gestao-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .gestao-header h1 {
                    font-size: 2rem;
                    font-weight: bold;
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }
                .back-button-gestao {
                    padding: 0.5rem 1.25rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #f8fafc;
                    background: rgba(100, 116, 139, 0.3);
                    border: 1px solid rgba(255, 193, 7, 0.5);
                    border-radius: 9999px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                }
                .back-button-gestao:hover {
                    background: rgba(255, 193, 7, 0.2);
                    border-color: #fbbf24;
                    transform: translateX(-4px);
                }
                .resumo-cards { margin-bottom: 1.5rem; }
                .resumo-card {
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    border: 1px solid rgba(255, 193, 7, 0.2);
                }
                .resumo-card h3 { color: #f8fafc; font-size: 1.125rem; margin-bottom: 1rem; border-left: 4px solid #fbbf24; padding-left: 0.75rem; }
                .resumo-lista { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 0.5rem; }
                .resumo-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(30, 41, 59, 0.4); border-radius: 0.5rem; }
                .resumo-nome { color: #94a3b8; font-size: 0.875rem; }
                .resumo-valor { color: #fbbf24; font-weight: 600; font-size: 0.875rem; }
                .filtros-card {
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    border: 1px solid rgba(255, 193, 7, 0.2);
                }
                .filtros-card h3 { color: #f8fafc; font-size: 1.125rem; margin-bottom: 1rem; }
                .filtros-row { display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-end; justify-content: center; }
                .filtro-group { flex: 1; min-width: 180px; }
                .filtro-group label { display: block; font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.25rem; }
                .filtro-group input, .filtro-group select {
                    width: 100%;
                    padding: 0.5rem;
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(255, 193, 7, 0.3);
                    border-radius: 0.5rem;
                    color: #f8fafc;
                    font-size: 0.875rem;
                }
                .btn-limpar {
                    padding: 0.5rem 1rem;
                    background: rgba(239, 68, 68, 0.2);
                    border: 1px solid rgba(239, 68, 68, 0.4);
                    border-radius: 0.5rem;
                    color: #ef4444;
                    cursor: pointer;
                    font-weight: 600;
                    height: 38px;
                }
                .btn-limpar:hover { background: rgba(239, 68, 68, 0.4); }
                .tabela-card {
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    border: 1px solid rgba(255, 193, 7, 0.2);
                }
                .tabela-card h3 { color: #f8fafc; font-size: 1.125rem; margin-bottom: 1rem; }
                .tabela-wrapper { overflow-x: auto; }
                .tabela-gestao { width: 100%; border-collapse: collapse; }
                .tabela-gestao th, .tabela-gestao td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid rgba(148, 163, 184, 0.2); }
                .tabela-gestao th { color: #fbbf24; font-weight: 600; font-size: 0.875rem; }
                .tabela-gestao td { color: #f8fafc; font-size: 0.875rem; }
                .tabela-gestao tr:hover td { background: rgba(255, 193, 7, 0.05); }
                .btn-detalhar {
                    padding: 0.25rem 0.75rem;
                    background: rgba(59, 130, 246, 0.2);
                    border: 1px solid rgba(59, 130, 246, 0.4);
                    border-radius: 0.5rem;
                    color: #60a5fa;
                    cursor: pointer;
                    font-size: 0.75rem;
                    display: inline-flex;
                    align-items: center;
                }
                .btn-detalhar:hover { background: rgba(59, 130, 246, 0.4); transform: scale(1.02); }
                .sem-dados { text-align: center; color: #94a3b8; padding: 2rem; }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                    border-radius: 1.5rem;
                    width: 90%;
                    max-width: 550px;
                    max-height: 80vh;
                    overflow: hidden;
                    border: 1px solid rgba(255, 193, 7, 0.3);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid rgba(255, 193, 7, 0.2);
                }
                .modal-header h3 { color: #fbbf24; font-size: 1.125rem; margin: 0; }
                .modal-fechar { background: none; border: none; color: #94a3b8; font-size: 1.25rem; cursor: pointer; }
                .modal-fechar:hover { color: #ef4444; }
                .modal-body { padding: 1.5rem; overflow-y: auto; max-height: calc(80vh - 70px); }
                .info-funcionario {
                    background: rgba(30, 41, 59, 0.4);
                    border-radius: 0.75rem;
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: #cbd5e1;
                }
                .info-funcionario strong { color: #fbbf24; }
                .composicao h4 { color: #f8fafc; font-size: 1rem; margin-bottom: 1rem; border-left: 4px solid #22c55e; padding-left: 0.75rem; }
                .composicao-grid { display: flex; flex-direction: column; gap: 0.5rem; }
                .composicao-linha {
                    display: grid;
                    grid-template-columns: 1fr 70px 110px;
                    padding: 0.6rem 0.75rem;
                    background: rgba(30, 41, 59, 0.3);
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                }
                .composicao-linha.header { background: rgba(251, 191, 36, 0.15); color: #fbbf24; font-weight: 600; }
                .composicao-linha span:first-child { color: #cbd5e1; }
                .composicao-linha span:nth-child(2) { text-align: center; color: #94a3b8; }
                .composicao-linha span:last-child { text-align: right; font-weight: 600; }
                .valor-bruto { color: #fbbf24; }
                .total-encargos { background: rgba(239, 68, 68, 0.15); border-top: 1px solid rgba(239, 68, 68, 0.3); margin-top: 0.25rem; }
                .gestao-loading {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                    color: #f8fafc;
                }
                @media (max-width: 768px) {
                    .gestao-container { padding: 1rem; }
                    .gestao-header { flex-direction: column; align-items: flex-start; }
                    .filtros-row { flex-direction: column; }
                    .btn-limpar { width: 100%; }
                    .info-funcionario { grid-template-columns: 1fr; }
                    .composicao-linha { grid-template-columns: 1fr 55px 90px; font-size: 0.7rem; }
                }
            `}</style>
        </div>
    );
};

export default GestaoSalarial;