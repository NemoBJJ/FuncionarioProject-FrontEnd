import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  BarChart3, 
  DollarSign, 
  Search, 
  List, 
  Users, 
  Building, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  X 
} from 'lucide-react';
import api from '../api';

const DatabaseRH = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [filteredFuncionarios, setFilteredFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    
    // Filtros
    const [searchNome, setSearchNome] = useState('');
    const [searchId, setSearchId] = useState('');
    const [filtroCargo, setFiltroCargo] = useState('');
    const [filtroDepartamento, setFiltroDepartamento] = useState('');
    const [cargos, setCargos] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    
    // Relatórios inline
    const [relatorioCargos, setRelatorioCargos] = useState([]);
    const [relatorioDepartamentos, setRelatorioDepartamentos] = useState([]);
    
    // Modais
    const [modalAberto, setModalAberto] = useState(false);
    const [modalTitulo, setModalTitulo] = useState('');
    const [modalFuncionarios, setModalFuncionarios] = useState([]);

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
            setTotalElements(data.length);

            const cargosUnicos = [...new Set(data.map(f => f.cargo).filter(Boolean))];
            const deptsUnicos = [...new Set(data.map(f => f.departamento).filter(Boolean))];
            setCargos(cargosUnicos.sort());
            setDepartamentos(deptsUnicos.sort());

            const cargoCount = {};
            const deptSalary = {};
            
            data.forEach(f => {
                if (f.cargo) cargoCount[f.cargo] = (cargoCount[f.cargo] || 0) + 1;
                if (f.departamento && f.salario) {
                    deptSalary[f.departamento] = (deptSalary[f.departamento] || 0) + f.salario;
                }
            });

            setRelatorioCargos(Object.entries(cargoCount).map(([cargo, qtd]) => ({ cargo, qtd })));
            setRelatorioDepartamentos(Object.entries(deptSalary).map(([depto, total]) => ({ depto, total })));

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    // Aplicar filtros
    useEffect(() => {
        let filtered = [...funcionarios];
        
        if (searchId) {
            filtered = filtered.filter(f => f.id.toString() === searchId);
        }
        
        if (searchNome) {
            filtered = filtered.filter(f => 
                f.nome?.toLowerCase().includes(searchNome.toLowerCase())
            );
        }
        
        if (filtroCargo) {
            filtered = filtered.filter(f => f.cargo === filtroCargo);
        }
        
        if (filtroDepartamento) {
            filtered = filtered.filter(f => f.departamento === filtroDepartamento);
        }
        
        setFilteredFuncionarios(filtered);
        setTotalElements(filtered.length);
        setPage(0);
    }, [searchNome, searchId, filtroCargo, filtroDepartamento, funcionarios]);

    const limparFiltros = () => {
        setSearchNome('');
        setSearchId('');
        setFiltroCargo('');
        setFiltroDepartamento('');
    };

    const abrirModalPorCargo = (cargo) => {
        const funcionariosCargo = funcionarios.filter(f => f.cargo === cargo);
        setModalTitulo(`👥 Funcionários - ${cargo}`);
        setModalFuncionarios(funcionariosCargo);
        setModalAberto(true);
    };

    const abrirModalPorDepartamento = (departamento) => {
        const funcionariosDepto = funcionarios.filter(f => f.departamento === departamento);
        setModalTitulo(`🏢 Funcionários - ${departamento}`);
        setModalFuncionarios(funcionariosDepto);
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setModalFuncionarios([]);
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

    const getStatusBadge = (status) => {
        if (status === 'ATIVO') return 'badge-ativo';
        if (status === 'INATIVO') return 'badge-inativo';
        if (status === 'FERIAS') return 'badge-ferias';
        return 'badge-outro';
    };

    const getStatusText = (status) => {
        if (status === 'ATIVO') return 'Ativo';
        if (status === 'INATIVO') return 'Inativo';
        if (status === 'FERIAS') return 'Férias';
        return status || '-';
    };

    const itemsPerPage = 10;
    const startIndex = page * itemsPerPage;
    const paginatedFuncionarios = filteredFuncionarios.slice(startIndex, startIndex + itemsPerPage);
    const totalPagesFiltered = Math.ceil(filteredFuncionarios.length / itemsPerPage);

    if (loading && funcionarios.length === 0) {
        return (
            <div className="database-rh-loading">
                <p>Carregando funcionários...</p>
            </div>
        );
    }

    return (
        <div className="database-rh-container">
            <div className="database-rh-header">
                <Link to="/">
                    <button className="back-button-rh">
                        <ArrowLeft size={18} className="icon-back" />
                        Voltar ao Menu
                    </button>
                </Link>
                <h1>
                    <Database size={28} className="icon-header" />
                    Banco de Dados - RH
                </h1>
                <div className="total-count">Total: {totalElements} funcionários</div>
            </div>

            {/* SEÇÃO DE RELATÓRIOS INLINE - CLICÁVEIS */}
            <div className="reports-row">
                <div className="report-card clickable" onClick={() => setModalAberto(true)}>
                    <h3>
                        <BarChart3 size={20} className="icon-title" />
                        Funcionários por Cargo
                    </h3>
                    <div className="report-list">
                        {relatorioCargos.slice(0, 8).map((item, idx) => (
                            <div 
                                key={idx} 
                                className="report-item clickable-item"
                                onClick={(e) => { e.stopPropagation(); abrirModalPorCargo(item.cargo); }}
                            >
                                <span className="report-name">{item.cargo}</span>
                                <span className="report-value">{item.qtd} funcionário(s) →</span>
                            </div>
                        ))}
                        {relatorioCargos.length === 0 && <span className="no-data">Nenhum dado</span>}
                    </div>
                </div>
                
                <div className="report-card clickable">
                    <h3>
                        <DollarSign size={20} className="icon-title" />
                        Folha Salarial por Departamento
                    </h3>
                    <div className="report-list">
                        {relatorioDepartamentos.slice(0, 8).map((item, idx) => (
                            <div 
                                key={idx} 
                                className="report-item clickable-item"
                                onClick={() => abrirModalPorDepartamento(item.depto)}
                            >
                                <span className="report-name">{item.depto}</span>
                                <span className="report-value">{formatCurrency(item.total)} →</span>
                            </div>
                        ))}
                        {relatorioDepartamentos.length === 0 && <span className="no-data">Nenhum dado</span>}
                    </div>
                </div>
            </div>

            {/* FILTROS - CENTRALIZADOS */}
            <div className="filters-card-rh">
                <h3>
                    <Search size={20} className="icon-title" />
                    Filtros de Busca
                </h3>
                <div className="filters-row">
                    <div className="filter-group">
                        <label>Buscar por ID:</label>
                        <input
                            type="number"
                            placeholder="Digite o ID..."
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <label>Buscar por Nome:</label>
                        <input
                            type="text"
                            placeholder="Digite o nome..."
                            value={searchNome}
                            onChange={(e) => setSearchNome(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <label>Cargo:</label>
                        <select value={filtroCargo} onChange={(e) => setFiltroCargo(e.target.value)}>
                            <option value="">Todos</option>
                            {cargos.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Departamento:</label>
                        <select value={filtroDepartamento} onChange={(e) => setFiltroDepartamento(e.target.value)}>
                            <option value="">Todos</option>
                            {departamentos.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <button className="btn-clear-filters" onClick={limparFiltros}>Limpar Filtros</button>
                </div>
            </div>

            {/* TABELA DE FUNCIONÁRIOS */}
            <div className="table-card-rh">
                <h3>
                    <List size={20} className="icon-title" />
                    Lista de Funcionários
                </h3>
                <div className="table-wrapper-rh">
                    <table className="rh-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Cargo</th>
                                <th>Salário</th>
                                <th>Departamento</th>
                                <th>Admissão</th>
                                <th>Status</th>
                                <th>Email</th>
                                <th>Gestor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedFuncionarios.map((f) => (
                                <tr key={f.id}>
                                    <td>{f.id}</td>
                                    <td><strong>{f.nome || '-'}</strong></td>
                                    <td>{f.cargo || '-'}</td>
                                    <td className={f.salario >= 10000 ? 'high-salary' : ''}>
                                        {formatCurrency(f.salario)}
                                    </td>
                                    <td>{f.departamento || '-'}</td>
                                    <td>{formatDate(f.dataAdmissao)}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(f.statusEmprego)}`}>
                                            {getStatusText(f.statusEmprego)}
                                        </span>
                                    </td>
                                    <td className="email-cell">{f.email || '-'}</td>
                                    <td>{f.gestorDireto || '-'}</td>
                                </tr>
                            ))}
                            {paginatedFuncionarios.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="no-data">Nenhum funcionário encontrado</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPagesFiltered > 1 && (
                    <div className="pagination-rh">
                        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                            <ChevronLeft size={18} />
                            Anterior
                        </button>
                        <span className="page-info">
                            Página {page + 1} de {totalPagesFiltered}
                        </span>
                        <button onClick={() => setPage(p => Math.min(totalPagesFiltered - 1, p + 1))} disabled={page === totalPagesFiltered - 1}>
                            Próxima
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* MODAL */}
            {modalAberto && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                {modalTitulo.includes('Cargo') ? <Users size={20} className="icon-modal" /> : <Building size={20} className="icon-modal" />}
                                {modalTitulo}
                            </h3>
                            <button className="modal-close" onClick={fecharModal}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="modal-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Cargo</th>
                                        <th>Salário</th>
                                        <th>Departamento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalFuncionarios.map(f => (
                                        <tr key={f.id}>
                                            <td>{f.id}</td>
                                            <td><strong>{f.nome || '-'}</strong></td>
                                            <td>{f.cargo || '-'}</td>
                                            <td>{formatCurrency(f.salario)}</td>
                                            <td>{f.departamento || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <style jsx="true">{`
                .database-rh-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                    padding: 2rem;
                }

                .database-rh-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .database-rh-header h1 {
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

                .icon-back {
                    color: #f8fafc;
                    stroke-width: 2;
                    margin-right: 0.3rem;
                    vertical-align: middle;
                }

                .icon-modal {
                    color: #fbbf24;
                    stroke-width: 2;
                    margin-right: 0.5rem;
                    vertical-align: middle;
                }

                .total-count {
                    padding: 0.5rem 1rem;
                    background: rgba(255, 193, 7, 0.15);
                    border-radius: 2rem;
                    font-size: 0.875rem;
                    color: #fbbf24;
                }

                .back-button-rh {
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

                .back-button-rh:hover {
                    background: rgba(255, 193, 7, 0.2);
                    border-color: #fbbf24;
                    transform: translateX(-4px);
                }

                .reports-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                }

                .report-card {
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    border: 1px solid rgba(255, 193, 7, 0.2);
                }

                .report-card h3 {
                    display: flex;
                    align-items: center;
                    color: #f8fafc;
                    font-size: 1.125rem;
                    margin-bottom: 1rem;
                    border-left: 4px solid #fbbf24;
                    padding-left: 0.75rem;
                }

                .report-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .report-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem;
                    background: rgba(30, 41, 59, 0.4);
                    border-radius: 0.5rem;
                }

                .clickable-item {
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .clickable-item:hover {
                    background: rgba(251, 191, 36, 0.2);
                    transform: translateX(4px);
                }

                .report-name {
                    color: #94a3b8;
                    font-size: 0.875rem;
                }

                .report-value {
                    color: #fbbf24;
                    font-weight: 600;
                    font-size: 0.875rem;
                }

                .filters-card-rh {
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    border: 1px solid rgba(255, 193, 7, 0.2);
                }

                .filters-card-rh h3 {
                    display: flex;
                    align-items: center;
                    color: #f8fafc;
                    font-size: 1.125rem;
                    margin-bottom: 1rem;
                }

                /* 👇 FILTROS CENTRALIZADOS 👇 */
                .filters-row {
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .filter-group {
                    flex: 0 1 auto;
                    min-width: 150px;
                }

                .filter-group label {
                    display: block;
                    font-size: 0.75rem;
                    color: #94a3b8;
                    margin-bottom: 0.25rem;
                }

                .filter-group input,
                .filter-group select {
                    width: 100%;
                    padding: 0.5rem;
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(255, 193, 7, 0.3);
                    border-radius: 0.5rem;
                    color: #f8fafc;
                    font-size: 0.875rem;
                }

                .filter-group input:focus,
                .filter-group select:focus {
                    outline: none;
                    border-color: #fbbf24;
                }

                .btn-clear-filters {
                    padding: 0.5rem 1rem;
                    background: rgba(239, 68, 68, 0.2);
                    border: 1px solid rgba(239, 68, 68, 0.4);
                    border-radius: 0.5rem;
                    color: #ef4444;
                    cursor: pointer;
                    font-weight: 600;
                    height: 38px;
                    flex-shrink: 0;
                }

                .btn-clear-filters:hover {
                    background: rgba(239, 68, 68, 0.4);
                }

                .table-card-rh {
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    border: 1px solid rgba(255, 193, 7, 0.2);
                }

                .table-card-rh h3 {
                    display: flex;
                    align-items: center;
                    color: #f8fafc;
                    font-size: 1.125rem;
                    margin-bottom: 1rem;
                }

                .table-wrapper-rh {
                    overflow-x: auto;
                }

                .rh-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .rh-table th,
                .rh-table td {
                    padding: 0.75rem 1rem;
                    text-align: left;
                    border-bottom: 1px solid rgba(148, 163, 184, 0.2);
                }

                .rh-table th {
                    color: #fbbf24;
                    font-weight: 600;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .rh-table td {
                    color: #f8fafc;
                    font-size: 0.875rem;
                }

                .rh-table tr:hover td {
                    background: rgba(255, 193, 7, 0.05);
                }

                .high-salary {
                    color: #22c55e;
                    font-weight: 600;
                }

                .email-cell {
                    max-width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .badge-ativo {
                    background: rgba(34, 197, 94, 0.2);
                    color: #22c55e;
                    border: 1px solid rgba(34, 197, 94, 0.3);
                }

                .badge-inativo {
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.3);
                }

                .badge-ferias {
                    background: rgba(245, 158, 11, 0.2);
                    color: #fbbf24;
                    border: 1px solid rgba(245, 158, 11, 0.3);
                }

                .badge-outro {
                    background: rgba(100, 116, 139, 0.3);
                    color: #94a3b8;
                }

                .pagination-rh {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 1rem;
                    margin-top: 1.5rem;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(148, 163, 184, 0.2);
                }

                .pagination-rh button {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #f8fafc;
                    background: rgba(255, 193, 7, 0.15);
                    border: 1px solid rgba(255, 193, 7, 0.4);
                    border-radius: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .pagination-rh button:hover:not(:disabled) {
                    background: rgba(255, 193, 7, 0.3);
                    border-color: #fbbf24;
                }

                .pagination-rh button:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .page-info {
                    color: #94a3b8;
                    font-size: 0.875rem;
                }

                .no-data {
                    text-align: center;
                    color: #94a3b8;
                    padding: 2rem;
                }

                /* Modal */
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
                    max-width: 800px;
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

                .modal-header h3 {
                    display: flex;
                    align-items: center;
                    color: #fbbf24;
                    font-size: 1.25rem;
                    margin: 0;
                }

                .modal-close {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    transition: color 0.2s;
                    display: flex;
                    align-items: center;
                }

                .modal-close:hover {
                    color: #ef4444;
                }

                .modal-body {
                    padding: 1.5rem;
                    overflow-y: auto;
                    max-height: calc(80vh - 70px);
                }

                .modal-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .modal-table th,
                .modal-table td {
                    padding: 0.75rem;
                    text-align: left;
                    border-bottom: 1px solid rgba(148, 163, 184, 0.2);
                }

                .modal-table th {
                    color: #fbbf24;
                    font-weight: 600;
                }

                .modal-table td {
                    color: #f8fafc;
                }

                .database-rh-loading {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                    color: #f8fafc;
                }

                @media (max-width: 768px) {
                    .database-rh-container {
                        padding: 1rem;
                    }
                    .database-rh-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .reports-row {
                        grid-template-columns: 1fr;
                    }
                    .filters-row {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .btn-clear-filters {
                        width: 100%;
                    }
                    .modal-content {
                        width: 95%;
                    }
                    .pagination-rh button {
                        font-size: 0.75rem;
                        padding: 0.3rem 0.6rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default DatabaseRH;