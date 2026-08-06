import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, UserPlus, Search, X, Trash2, Edit, Eye, 
  Users, Briefcase, DollarSign, Building2, Calendar, 
  MapPin, Mail, Phone, Award, User, UserCog, 
  ArrowLeft, Plus, Save, List, UserCheck, UserX,
  Home, Clock
} from 'lucide-react';
import api from '../api';

const GerenciarFuncionarios = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);
    const [modalTitulo, setModalTitulo] = useState('');
    const [editando, setEditando] = useState(false);
    
    // Formulário de novo funcionário / edição
    const [formData, setFormData] = useState({
        id: null,
        nome: '',
        cargo: '',
        salario: '',
        departamento: '',
        dataAdmissao: '',
        dataNascimento: '',
        cidade: '',
        estado: '',
        statusEmprego: 'ATIVO',
        email: '',
        telefone: '',
        nivelExperiencia: '',
        sexo: '',
        gestorDireto: '',
        bonus: ''
    });

    // Buscar ID para editar/excluir
    const [buscaId, setBuscaId] = useState('');
    const [funcionarioEncontrado, setFuncionarioEncontrado] = useState(null);

    useEffect(() => {
        carregarFuncionarios();
    }, []);

    const carregarFuncionarios = async () => {
        setLoading(true);
        try {
            const response = await api.get('/funcionarios?size=100');
            setFuncionarios(response.data.content || []);
        } catch (error) {
            console.error('Erro ao carregar funcionários:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            id: null,
            nome: '',
            cargo: '',
            salario: '',
            departamento: '',
            dataAdmissao: '',
            dataNascimento: '',
            cidade: '',
            estado: '',
            statusEmprego: 'ATIVO',
            email: '',
            telefone: '',
            nivelExperiencia: '',
            sexo: '',
            gestorDireto: '',
            bonus: ''
        });
        setEditando(false);
        setModalAberto(false);
        setFuncionarioEncontrado(null);
        setBuscaId('');
    };

    const abrirModalAdicionar = () => {
        resetForm();
        setEditando(false);
        setModalTitulo('Adicionar Novo Funcionário');
        setModalAberto(true);
    };

    const abrirModalEditar = (funcionario) => {
        setFormData({
            id: funcionario.id,
            nome: funcionario.nome || '',
            cargo: funcionario.cargo || '',
            salario: funcionario.salario || '',
            departamento: funcionario.departamento || '',
            dataAdmissao: funcionario.dataAdmissao || '',
            dataNascimento: funcionario.dataNascimento || '',
            cidade: funcionario.cidade || '',
            estado: funcionario.estado || '',
            statusEmprego: funcionario.statusEmprego || 'ATIVO',
            email: funcionario.email || '',
            telefone: funcionario.telefone || '',
            nivelExperiencia: funcionario.nivelExperiencia || '',
            sexo: funcionario.sexo || '',
            gestorDireto: funcionario.gestorDireto || '',
            bonus: funcionario.bonus || ''
        });
        setEditando(true);
        setModalTitulo(`Editar Funcionário - ${funcionario.nome}`);
        setModalAberto(true);
    };

    const buscarFuncionarioPorId = async () => {
        if (!buscaId) {
            alert('Digite um ID para buscar');
            return;
        }
        try {
            const response = await api.get(`/funcionarios/${buscaId}`);
            setFuncionarioEncontrado(response.data);
        } catch (error) {
            console.error('Erro ao buscar funcionário:', error);
            setFuncionarioEncontrado(null);
            alert('Funcionário não encontrado!');
        }
    };

    const salvarFuncionario = async () => {
        if (!formData.nome || !formData.cargo || !formData.salario) {
            alert('Preencha Nome, Cargo e Salário!');
            return;
        }

        try {
            const payload = {
                ...formData,
                salario: parseFloat(formData.salario)
            };

            if (editando && formData.id) {
                await api.put(`/funcionarios/${formData.id}`, payload);
                alert('Funcionário atualizado com sucesso!');
            } else {
                await api.post('/funcionarios', payload);
                alert('Funcionário adicionado com sucesso!');
            }
            resetForm();
            carregarFuncionarios();
        } catch (error) {
            console.error('Erro ao salvar funcionário:', error);
            alert('Erro ao salvar. Verifique os dados.');
        }
    };

    const excluirFuncionario = async (id, nome) => {
        if (window.confirm(`Tem certeza que deseja excluir ${nome}?`)) {
            try {
                await api.delete(`/funcionarios/${id}`);
                alert('Funcionário excluído com sucesso!');
                carregarFuncionarios();
                if (funcionarioEncontrado?.id === id) {
                    setFuncionarioEncontrado(null);
                    setBuscaId('');
                }
            } catch (error) {
                console.error('Erro ao excluir:', error);
                alert('Erro ao excluir funcionário');
            }
        }
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
            <div className="crud-loading">
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div className="crud-container">
            <div className="crud-header">
                <Link to="/">
                    <button className="back-button-crud">
                        <ArrowLeft size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        Voltar ao Menu
                    </button>
                </Link>
                <h1>
                    <Settings size={28} style={{ display: 'inline', marginRight: '10px', verticalAlign: 'middle' }} />
                    Gerenciar Funcionários
                </h1>
                <button className="btn-add-crud" onClick={abrirModalAdicionar}>
                    <UserPlus size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Novo Funcionário
                </button>
            </div>

            {/* Busca por ID */}
            <div className="busca-card">
                <h3>
                    <Search size={20} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                    Buscar Funcionário por ID
                </h3>
                <div className="busca-row">
                    <input
                        type="number"
                        placeholder="Digite o ID"
                        value={buscaId}
                        onChange={(e) => setBuscaId(e.target.value)}
                    />
                    <button className="btn-buscar" onClick={buscarFuncionarioPorId}>
                        <Search size={16} style={{ marginRight: '4px' }} />
                        Buscar
                    </button>
                    <button className="btn-limpar-busca" onClick={() => { setBuscaId(''); setFuncionarioEncontrado(null); }}>
                        <X size={16} style={{ marginRight: '4px' }} />
                        Limpar
                    </button>
                </div>

                {funcionarioEncontrado && (
                    <div className="resultado-busca">
                        <div className="resultado-header">
                            <span><User size={16} style={{ marginRight: '4px' }} /> Funcionário encontrado!</span>
                            <div className="resultado-acoes">
                                <button className="btn-editar" onClick={() => abrirModalEditar(funcionarioEncontrado)}>
                                    <Edit size={16} style={{ marginRight: '4px' }} />
                                    Editar
                                </button>
                                <button className="btn-excluir" onClick={() => excluirFuncionario(funcionarioEncontrado.id, funcionarioEncontrado.nome)}>
                                    <Trash2 size={16} style={{ marginRight: '4px' }} />
                                    Excluir
                                </button>
                            </div>
                        </div>
                        <div className="resultado-info">
                            <div><strong>ID:</strong> {funcionarioEncontrado.id}</div>
                            <div><strong>Nome:</strong> {funcionarioEncontrado.nome}</div>
                            <div><strong>Cargo:</strong> {funcionarioEncontrado.cargo}</div>
                            <div><strong>Salário:</strong> {formatCurrency(funcionarioEncontrado.salario)}</div>
                            <div><strong>Departamento:</strong> {funcionarioEncontrado.departamento}</div>
                            <div><strong>Status:</strong> {funcionarioEncontrado.statusEmprego}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Lista de Funcionários */}
            <div className="lista-card">
                <h3>
                    <List size={20} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                    Lista de Funcionários
                </h3>
                <div className="tabela-wrapper">
                    <table className="crud-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Cargo</th>
                                <th>Salário</th>
                                <th>Departamento</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {funcionarios.map((f) => (
                                <tr key={f.id}>
                                    <td>{f.id}</td>
                                    <td><strong>{f.nome || '-'}</strong></td>
                                    <td>{f.cargo || '-'}</td>
                                    <td>{formatCurrency(f.salario)}</td>
                                    <td>{f.departamento || '-'}</td>
                                    <td>
                                        <span className={`status-badge ${f.statusEmprego === 'ATIVO' ? 'status-ativo' : 'status-inativo'}`}>
                                            {f.statusEmprego === 'ATIVO' ? <UserCheck size={14} style={{ marginRight: '4px' }} /> : <UserX size={14} style={{ marginRight: '4px' }} />}
                                            {f.statusEmprego || '-'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-editar-mini" onClick={() => abrirModalEditar(f)}>
                                            <Edit size={18} />
                                        </button>
                                        <button className="btn-excluir-mini" onClick={() => excluirFuncionario(f.id, f.nome)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {funcionarios.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="sem-dados">Nenhum funcionário cadastrado</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL DE ADICIONAR/EDITAR */}
            {modalAberto && (
                <div className="modal-overlay" onClick={() => resetForm()}>
                    <div className="modal-content modal-crud" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                {editando ? <Edit size={20} style={{ marginRight: '6px' }} /> : <UserPlus size={20} style={{ marginRight: '6px' }} />}
                                {modalTitulo}
                            </h3>
                            <button className="modal-fechar" onClick={resetForm}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body modal-body-crud">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label><User size={14} style={{ marginRight: '4px' }} /> Nome *</label>
                                    <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label><Briefcase size={14} style={{ marginRight: '4px' }} /> Cargo *</label>
                                    <input type="text" name="cargo" value={formData.cargo} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label><DollarSign size={14} style={{ marginRight: '4px' }} /> Salário *</label>
                                    <input type="number" step="0.01" name="salario" value={formData.salario} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label><Building2 size={14} style={{ marginRight: '4px' }} /> Departamento</label>
                                    <input type="text" name="departamento" value={formData.departamento} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label><Calendar size={14} style={{ marginRight: '4px' }} /> Data de Admissão</label>
                                    <input type="date" name="dataAdmissao" value={formData.dataAdmissao} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label><Clock size={14} style={{ marginRight: '4px' }} /> Data de Nascimento</label>
                                    <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label><MapPin size={14} style={{ marginRight: '4px' }} /> Cidade</label>
                                    <input type="text" name="cidade" value={formData.cidade} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label><MapPin size={14} style={{ marginRight: '4px' }} /> Estado</label>
                                    <input type="text" name="estado" value={formData.estado} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label><UserCheck size={14} style={{ marginRight: '4px' }} /> Status</label>
                                    <select name="statusEmprego" value={formData.statusEmprego} onChange={handleInputChange}>
                                        <option value="ATIVO">ATIVO</option>
                                        <option value="INATIVO">INATIVO</option>
                                        <option value="FERIAS">FÉRIAS</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label><Mail size={14} style={{ marginRight: '4px' }} /> Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label><Phone size={14} style={{ marginRight: '4px' }} /> Telefone</label>
                                    <input type="text" name="telefone" value={formData.telefone} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label><Award size={14} style={{ marginRight: '4px' }} /> Nível de Experiência</label>
                                    <select name="nivelExperiencia" value={formData.nivelExperiencia} onChange={handleInputChange}>
                                        <option value="">Selecione</option>
                                        <option value="JUNIOR">Júnior</option>
                                        <option value="PLENO">Pleno</option>
                                        <option value="SENIOR">Sênior</option>
                                        <option value="ESPECIALISTA">Especialista</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label><UserCog size={14} style={{ marginRight: '4px' }} /> Sexo</label>
                                    <select name="sexo" value={formData.sexo} onChange={handleInputChange}>
                                        <option value="">Selecione</option>
                                        <option value="MASCULINO">Masculino</option>
                                        <option value="FEMININO">Feminino</option>
                                        <option value="OUTRO">Outro</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label><UserCog size={14} style={{ marginRight: '4px' }} /> Gestor Direto</label>
                                    <input type="text" name="gestorDireto" value={formData.gestorDireto} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label><DollarSign size={14} style={{ marginRight: '4px' }} /> Bônus (%)</label>
                                    <input type="number" step="0.01" name="bonus" value={formData.bonus} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button className="btn-salvar" onClick={salvarFuncionario}>
                                    <Save size={18} style={{ marginRight: '6px' }} />
                                    Salvar
                                </button>
                                <button className="btn-cancelar" onClick={resetForm}>
                                    <X size={18} style={{ marginRight: '6px' }} />
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx="true">{`
                .crud-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                    padding: 2rem;
                }

                .crud-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .crud-header h1 {
                    font-size: 2rem;
                    font-weight: bold;
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                .back-button-crud, .btn-add-crud {
                    padding: 0.5rem 1.25rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    border-radius: 9999px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                }

                .back-button-crud {
                    color: #f8fafc;
                    background: rgba(100, 116, 139, 0.3);
                    border: 1px solid rgba(255, 193, 7, 0.5);
                }

                .back-button-crud:hover {
                    background: rgba(255, 193, 7, 0.2);
                    border-color: #fbbf24;
                    transform: translateX(-4px);
                }

                .btn-add-crud {
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    border: none;
                    color: white;
                }

                .btn-add-crud:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
                }

                .busca-card, .lista-card {
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    border: 1px solid rgba(255, 193, 7, 0.2);
                }

                .busca-card h3, .lista-card h3 {
                    color: #f8fafc;
                    font-size: 1.125rem;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                }

                .busca-row {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    align-items: center;
                }

                .busca-row input {
                    flex: 1;
                    min-width: 180px;
                    padding: 0.5rem;
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(255, 193, 7, 0.3);
                    border-radius: 0.5rem;
                    color: #f8fafc;
                }

                .btn-buscar, .btn-limpar-busca {
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                }

                .btn-buscar {
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    border: none;
                    color: white;
                }

                .btn-limpar-busca {
                    background: rgba(100, 116, 139, 0.3);
                    border: 1px solid rgba(255, 193, 7, 0.4);
                    color: #f8fafc;
                }

                .resultado-busca {
                    margin-top: 1rem;
                    padding: 1rem;
                    background: rgba(30, 41, 59, 0.4);
                    border-radius: 0.75rem;
                }

                .resultado-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                    color: #fbbf24;
                    font-weight: bold;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .resultado-acoes {
                    display: flex;
                    gap: 0.5rem;
                }

                .resultado-acoes button {
                    padding: 0.25rem 0.75rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.8rem;
                }

                .btn-editar {
                    background: rgba(59, 130, 246, 0.2);
                    border: 1px solid rgba(59, 130, 246, 0.4);
                    color: #60a5fa;
                }

                .btn-excluir {
                    background: rgba(239, 68, 68, 0.2);
                    border: 1px solid rgba(239, 68, 68, 0.4);
                    color: #f87171;
                }

                .resultado-info {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: #cbd5e1;
                }

                .tabela-wrapper {
                    overflow-x: auto;
                }

                .crud-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .crud-table th,
                .crud-table td {
                    padding: 0.75rem 1rem;
                    text-align: left;
                    border-bottom: 1px solid rgba(148, 163, 184, 0.2);
                }

                .crud-table th {
                    color: #fbbf24;
                    font-weight: 600;
                    font-size: 0.875rem;
                }

                .crud-table td {
                    color: #f8fafc;
                    font-size: 0.875rem;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .status-ativo {
                    background: rgba(34, 197, 94, 0.2);
                    color: #22c55e;
                }

                .status-inativo {
                    background: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                }

                .btn-editar-mini, .btn-excluir-mini {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.25rem 0.5rem;
                    color: #94a3b8;
                    transition: color 0.2s;
                }

                .btn-editar-mini:hover {
                    color: #60a5fa;
                }

                .btn-excluir-mini:hover {
                    color: #f87171;
                }

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

                .modal-crud {
                    max-width: 800px;
                    width: 90%;
                    max-height: 85vh;
                    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                    border-radius: 1.5rem;
                    border: 1px solid rgba(255, 193, 7, 0.3);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid rgba(255, 193, 7, 0.2);
                }

                .modal-header h3 {
                    color: #fbbf24;
                    font-size: 1.125rem;
                    display: flex;
                    align-items: center;
                }

                .modal-fechar {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 4px;
                }

                .modal-fechar:hover {
                    color: #ef4444;
                }

                .modal-body-crud {
                    padding: 1.5rem;
                    max-height: calc(85vh - 70px);
                    overflow-y: auto;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .form-group label {
                    font-size: 0.75rem;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .form-group input, .form-group select {
                    padding: 0.5rem;
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(255, 193, 7, 0.3);
                    border-radius: 0.5rem;
                    color: #f8fafc;
                }

                .form-group input:focus, .form-group select:focus {
                    outline: none;
                    border-color: #fbbf24;
                    box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.2);
                }

                .form-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.5rem;
                    justify-content: flex-end;
                }

                .btn-salvar, .btn-cancelar {
                    padding: 0.5rem 1.5rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }

                .btn-salvar {
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    border: none;
                    color: white;
                }

                .btn-salvar:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
                }

                .btn-cancelar {
                    background: rgba(100, 116, 139, 0.3);
                    border: 1px solid rgba(255, 193, 7, 0.4);
                    color: #f8fafc;
                }

                .btn-cancelar:hover {
                    background: rgba(239, 68, 68, 0.2);
                    border-color: #ef4444;
                }

                .sem-dados {
                    text-align: center;
                    color: #94a3b8;
                    padding: 2rem;
                }

                .crud-loading {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                    color: #f8fafc;
                }

                @media (max-width: 768px) {
                    .crud-container {
                        padding: 1rem;
                    }
                    .crud-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                    .busca-row {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .resultado-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }
            `}</style>
        </div>
    );
};

export default GerenciarFuncionarios;