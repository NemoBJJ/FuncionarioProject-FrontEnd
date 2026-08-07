import React, { useState, useEffect } from 'react';
import ReconhecimentoFacial from './ReconhecimentoFacial';
import api from '../api';
import './CadastroFacial.css';
import {
  Smile,
  CheckCircle,
  XCircle,
  RefreshCw,
  Camera,
  User,
  Briefcase,
  Loader2
} from 'lucide-react';

const CadastroFacial = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      const response = await api.get('/funcionarios');
      setFuncionarios(response.data.content || []);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCadastrarFace = (funcionario) => {
    setSelectedFuncionario(funcionario);
    setShowFaceModal(true);
  };

  const handleFaceCadastrada = () => {
    alert(`✅ Face cadastrada para ${selectedFuncionario.nome} com sucesso!`);
    setShowFaceModal(false);
    setSelectedFuncionario(null);
    carregarFuncionarios();
  };

  if (loading) {
    return (
      <div className="loading">
        <Loader2 size={32} className="loading-spinner" />
        Carregando funcionários...
      </div>
    );
  }

  return (
    <div className="cadastro-container">
      <h2>
        <Smile size={28} className="icon-header" />
        Cadastro Facial de Funcionários
      </h2>
      
      <div className="funcionarios-grid">
        {funcionarios.map(func => (
          <div key={func.id} className="funcionario-card">
            <div className="funcionario-avatar">
              {func.faceDescriptor ? (
                <CheckCircle size={32} className="icon-cadastrado" />
              ) : (
                <XCircle size={32} className="icon-nao-cadastrado" />
              )}
            </div>
            <h3>
              <User size={16} className="icon-user" />
              {func.nome}
            </h3>
            <p>
              <Briefcase size={14} className="icon-cargo" />
              {func.cargo || 'Cargo não definido'}
            </p>
            <p className="face-status">
              Status Face: 
              <span className={func.faceDescriptor ? 'status-cadastrado' : 'status-nao-cadastrado'}>
                {func.faceDescriptor ? (
                  <>
                    <CheckCircle size={14} className="status-icon" />
                    Cadastrada
                  </>
                ) : (
                  <>
                    <XCircle size={14} className="status-icon" />
                    Não cadastrada
                  </>
                )}
              </span>
            </p>
            <button 
              className={func.faceDescriptor ? 'btn-recadastrar' : 'btn-cadastrar'}
              onClick={() => handleCadastrarFace(func)}
            >
              {func.faceDescriptor ? (
                <>
                  <RefreshCw size={16} className="btn-icon" />
                  Recadastrar Face
                </>
              ) : (
                <>
                  <Camera size={16} className="btn-icon" />
                  Cadastrar Face
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {showFaceModal && selectedFuncionario && (
        <ReconhecimentoFacial
          funcionarioId={selectedFuncionario.id}
          onClose={() => setShowFaceModal(false)}
          onSucesso={handleFaceCadastrada}
        />
      )}
    </div>
  );
};

export default CadastroFacial;