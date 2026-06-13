import React, { useState } from 'react';
import './AgendaEventos.css';

const AgendaEventos = () => {
  const [eventos, setEventos] = useState([
    {
      id: 1,
      titulo: '🎉 Aniversário da Empresa',
      data: '2026-05-20',
      descricao: 'Comemoração dos 5 anos da GesteX',
      tipo: 'celebracao'
    },
    {
      id: 2,
      titulo: '📊 Fechamento do Mês',
      data: '2026-05-31',
      descricao: 'Prazo para envio de relatórios financeiros',
      tipo: 'deadline'
    },
    {
      id: 3,
      titulo: '👥 Reunião de Equipe',
      data: '2026-05-19',
      descricao: 'Alinhamento de metas do trimestre',
      tipo: 'reuniao'
    },
    {
      id: 4,
      titulo: '💳 Pagamento de Funcionários',
      data: '2026-06-05',
      descricao: 'Processamento da folha de pagamento',
      tipo: 'financeiro'
    },
    {
      id: 5,
      titulo: '📝 Envio de Notas Fiscais',
      data: '2026-05-25',
      descricao: 'Prazo para envio de NF do mês',
      tipo: 'deadline'
    },
    {
      id: 6,
      titulo: '🎓 Treinamento RH',
      data: '2026-05-22',
      descricao: 'Atualização sobre LGPD',
      tipo: 'reuniao'
    }
  ]);

  const [novaData, setNovaData] = useState('');
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [mesAtual, setMesAtual] = useState(new Date().getMonth());
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());

  const adicionarEvento = () => {
    if (!novaData || !novoTitulo) return;
    const novoEvento = {
      id: Date.now(),
      titulo: novoTitulo,
      data: novaData,
      descricao: novaDescricao || 'Sem descrição',
      tipo: 'personalizado'
    };
    setEventos([...eventos, novoEvento]);
    setNovaData('');
    setNovoTitulo('');
    setNovaDescricao('');
    setShowForm(false);
  };

  const deletarEvento = (id) => {
    setEventos(eventos.filter(e => e.id !== id));
  };

  const getTipoIcon = (tipo) => {
    switch(tipo) {
      case 'celebracao': return '🎉';
      case 'deadline': return '⚠️';
      case 'reuniao': return '👥';
      case 'financeiro': return '💰';
      default: return '📌';
    }
  };

  const getTipoCor = (tipo) => {
    switch(tipo) {
      case 'celebracao': return '#28a745';
      case 'deadline': return '#dc3545';
      case 'reuniao': return '#17a2b8';
      case 'financeiro': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
  const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();
  const botoesSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  
  const eventosPorData = {};
  eventos.forEach(evento => {
    if (!eventosPorData[evento.data]) {
      eventosPorData[evento.data] = [];
    }
    eventosPorData[evento.data].push(evento);
  });

  const mesAnterior = () => {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual(anoAtual - 1);
    } else {
      setMesAtual(mesAtual - 1);
    }
  };

  const mesProximo = () => {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual(anoAtual + 1);
    } else {
      setMesAtual(mesAtual + 1);
    }
  };

  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const hoje = new Date().toISOString().split('T')[0];

  return (
    <div className="agenda-container">
      <div className="agenda-header">
        <h2>📅 Agenda de Eventos</h2>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✖ Fechar' : '+ Novo Evento'}
        </button>
      </div>

      {showForm && (
        <div className="evento-form">
          <input
            type="text"
            placeholder="Título do evento"
            value={novoTitulo}
            onChange={(e) => setNovoTitulo(e.target.value)}
          />
          <input
            type="date"
            value={novaData}
            onChange={(e) => setNovaData(e.target.value)}
          />
          <input
            type="text"
            placeholder="Descrição (opcional)"
            value={novaDescricao}
            onChange={(e) => setNovaDescricao(e.target.value)}
          />
          <button onClick={adicionarEvento}>Adicionar Evento</button>
        </div>
      )}

      <div className="calendario">
        <div className="calendario-nav">
          <button onClick={mesAnterior}>◀ {meses[mesAtual === 0 ? 11 : mesAtual - 1]}</button>
          <h3>{meses[mesAtual]} {anoAtual}</h3>
          <button onClick={mesProximo}>{meses[mesAtual === 11 ? 0 : mesAtual + 1]} ▶</button>
        </div>

        <div className="calendario-semana">
          {botoesSemana.map((dia, idx) => (
            <div key={idx} className="semana-dia">{dia}</div>
          ))}
        </div>

        <div className="calendario-dias">
          {Array(primeiroDiaSemana).fill(null).map((_, idx) => (
            <div key={`empty-${idx}`} className="dia vazio"></div>
          ))}
          {Array(diasNoMes).fill(null).map((_, idx) => {
            const dia = idx + 1;
            const dataStr = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            const eventosDia = eventosPorData[dataStr] || [];
            const isHoje = dataStr === hoje;
            
            return (
              <div key={dia} className={`dia ${isHoje ? 'hoje' : ''} ${eventosDia.length > 0 ? 'com-evento' : ''}`}>
                <span className="dia-numero">{dia}</span>
                {eventosDia.slice(0, 2).map(evento => (
                  <div 
                    key={evento.id} 
                    className="evento-mini" 
                    style={{ backgroundColor: getTipoCor(evento.tipo) }}
                    title={evento.descricao}
                  >
                    {getTipoIcon(evento.tipo)} {evento.titulo.length > 15 ? evento.titulo.substring(0, 12) + '...' : evento.titulo}
                  </div>
                ))}
                {eventosDia.length > 2 && (
                  <div className="evento-mini mais">+{eventosDia.length - 2}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="lista-eventos">
        <h3>📌 Próximos Eventos</h3>
        <div className="eventos-list">
          {eventos
            .sort((a, b) => a.data.localeCompare(b.data))
            .slice(0, 5)
            .map(evento => (
              <div key={evento.id} className="evento-card" style={{ borderLeftColor: getTipoCor(evento.tipo) }}>
                <div className="evento-info">
                  <div className="evento-data">
                    <strong>{evento.data.split('-').reverse().join('/')}</strong>
                  </div>
                  <div className="evento-titulo">
                    {getTipoIcon(evento.tipo)} {evento.titulo}
                  </div>
                  <div className="evento-descricao">{evento.descricao}</div>
                </div>
                <button className="evento-delete" onClick={() => deletarEvento(evento.id)}>🗑️</button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AgendaEventos;