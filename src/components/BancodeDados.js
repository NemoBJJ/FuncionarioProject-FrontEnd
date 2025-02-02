import React, { useEffect, useState } from 'react'; 
import './BancodeDados.css';

// Defina a URL base do backend da AWS com o novo IP Elástico
const API_BASE_URL = 'http://3.217.55.187:8082';

const BancodeDados = () => {
    const [dados, setDados] = useState([]); // Armazena os dados dos funcionários
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [erro, setErro] = useState(null); // Armazena erros

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/funcionarios`) // Conecta ao endpoint da AWS
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setDados(data.content); // Acessa os dados em "content"
                setLoading(false); // Finaliza o carregamento
            })
            .catch((error) => {
                console.error('Erro ao carregar os dados:', error);
                setErro(error.message); // Armazena o erro no estado
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="loading">Carregando os dados...</div>; // Indicador de carregamento
    }

    if (erro) {
        return <div className="error">Erro ao carregar os dados: {erro}</div>; // Exibe mensagem de erro
    }

    return (
        <div className="database-container">
            <h1 className="database-title">Banco de Dados de Funcionários</h1>
            <table className="database-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Cargo</th>
                        <th>Salário</th>
                        <th>Departamento</th>
                        <th>Data de Admissão</th>
                        <th>Cidade</th>
                        <th>Estado</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {dados.map((funcionario) => (
                        <tr key={funcionario.id}>
                            <td>{funcionario.id}</td>
                            <td>{funcionario.nome}</td>
                            <td>{funcionario.cargo}</td>
                            <td>R$ {funcionario.salario.toFixed(2)}</td>
                            <td>{funcionario.departamento}</td>
                            <td>{funcionario.dataAdmissao}</td>
                            <td>{funcionario.cidade}</td>
                            <td>{funcionario.estado}</td>
                            <td>{funcionario.statusEmprego}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BancodeDados;
