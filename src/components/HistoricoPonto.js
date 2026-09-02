import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  RefreshCw,
  ChartColumn,
  ArrowLeft
} from 'lucide-react';
import api from '../api';
import './HistoricoPonto.css';

const HistoricoPonto = () => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroData, setFiltroData] = useState('');

  useEffect(() => {
    carregarRegistros();
  }, []);

  const carregarRegistros = async () => {
    try {
      const response = await api.get('/funcionarios/ponto/historico');
      setRegistros(response.data);
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    } finally {
      setLoading(false);
    }
  };

  const registrosFiltrados = registros.filter(reg => {
    let match = true;

    if (
      filtroNome &&
      !reg.funcionarioNome
        .toLowerCase()
        .includes(filtroNome.toLowerCase())
    ) {
      match = false;
    }

    if (
      filtroData &&
      !reg.dataHora.startsWith(filtroData)
    ) {
      match = false;
    }

    return match;
  });

  const formatarData = (dataHora) => {
    if (!dataHora) {
      return '-';
    }

    const possuiTimezone =
      dataHora.endsWith('Z') ||
      /[+-]\d{2}:\d{2}$/.test(dataHora);

    const dataCorrigida = possuiTimezone
      ? dataHora
      : `${dataHora}Z`;

    const data = new Date(dataCorrigida);

    return data.toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'medium'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        Carregando registros de ponto...
      </div>
    );
  }

  return (
    <div className="historico-container">

      <h2
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <ClipboardList size={30} />
        Histórico de Ponto Facial
      </h2>

      <div className="filtros">

        <div className="filtro-group">
          <label>Funcionário:</label>

          <input
            type="text"
            placeholder="Digite o nome"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />
        </div>

        <div className="filtro-group">
          <label>Data:</label>

          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
          />
        </div>

        <button
          className="btn-limpar"
          onClick={() => {
            setFiltroNome('');
            setFiltroData('');
          }}
        >
          Limpar Filtros
        </button>

        <button
          className="btn-atualizar"
          onClick={carregarRegistros}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <RefreshCw size={18} />
          Atualizar
        </button>

      </div>

      <div className="tabela-container">
        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Funcionário</th>
              <th>Data/Hora</th>
              <th>Tipo</th>
              <th>Similaridade</th>
            </tr>
          </thead>

          <tbody>

            {registrosFiltrados.length === 0 ? (

              <tr className="nenhum-registro">
                <td colSpan="5">
                  Nenhum registro de ponto encontrado
                </td>
              </tr>

            ) : (

              registrosFiltrados.map((reg) => (

                <tr key={reg.id}>
                  <td>{reg.id}</td>

                  <td>
                    <strong>
                      {reg.funcionarioNome}
                    </strong>
                  </td>

                  <td>
                    {formatarData(reg.dataHora)}
                  </td>

                  <td className="tipo-entrada">
                    {reg.tipo}
                  </td>

                  <td>
                    {(reg.similaridade * 100).toFixed(1)}%
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>
      </div>

      <div
        className="stats"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <ChartColumn size={20} />

        <p>
          Total de registros:
          <strong>
            {' '}
            {registrosFiltrados.length}
          </strong>
        </p>
      </div>

      <div className="back-button-container">

        <Link to="/">
          <button
            className="back-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={18} />
            Voltar ao Menu
          </button>
        </Link>

      </div>

    </div>
  );
};

export default HistoricoPonto;